import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import {USERCOLOURS} from './conts/colours';
import {generateTeamCode} from './teamCodes';
export const database = firebase
  .app()
  .database(
    'https://calendarauth-b8522-default-rtdb.europe-west1.firebasedatabase.app/',
  );
export const user = auth().currentUser;
export const userid = user.uid;
export const userRef = database.ref('/users/' + userid);

export const submitUser = (Id, Name, Position) => {
  return new Promise(function (resolve, reject) {
    let key;
    if (Id != null) {
      //if user exists in the system
      key = Id;
    } else {
      key = database //if user doesnt exist in the system
        .ref()
        .push().key;
    }
    let dataToSave = {
      Id: key,
      Name: Name,
      Position: Position,
    };
    database
      .ref('users/' + key)
      .update(dataToSave)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const editUserHours = (id, hours) => {
  database.ref('/users/' + id).update({
    hours: parseInt(hours),
  });
};

export const editUserInfo = (id, inputs) => {
  database.ref('/users/' + id).update({
    firstname: inputs.firstname,
    lastname: inputs.lastname,
    hours: parseInt(inputs.hours),
    phone: inputs.phone,
  });
};

export async function removeUserFromTeam(id) {
  const snapshot = await database.ref('/users/' + id + '/team/').once('value');
  const teamId = snapshot.val();
  database.ref('/teams/' + teamId + '/members/' + id).remove();
  database.ref('/users/' + id).update({
    team: '',
  });

  // remove all time off requests made by that user
  const requestSnapshot = await database
    .ref('/teams/' + teamId + '/requests/')
    .orderByChild('sender')
    .equalTo(id)
    .once('value');
  const requests = [];
  requestSnapshot.forEach(function (childSnapshot) {
    requests.push(childSnapshot.val());
  });
  requests.forEach(request => {
    database.ref('/teams/' + teamId + '/requests/' + request.Id).remove();
  });
}

export const addUserDetails = (fname, lname, id, phone, email) => {
  database
    .ref('/users/')
    .update({
      [id]: {
        firstname: fname,
        lastname: lname,
        team: '',
        Id: id,
        phone: phone,
        email: email,
      },
    })
    .then(() => console.log('Data set.'));
};

export const addEmployeeDetails = (id, isAdmin, hours) => {
  database
    .ref('/users/' + id)
    .update({
      isAdmin: isAdmin,
      hours: parseInt(hours),
    })
    .then(() => console.log('Data set.'));
};

export function checkIfInTeam(user) {
  const userRef = database.ref('users/' + user.uid);
  userRef.once('value').then(snapshot => {
    let info = snapshot.val();
    return info.team !== '';
  });
}

export async function assignTeamToUser(id, teamid) {
  // creates array of all possible user colours
  let possibleColours = [...USERCOLOURS];

  const users = await database
    .ref('/users/')
    .orderByChild('team')
    .equalTo(teamid)
    .once('value');

  // removes all currently used colours from array
  users.forEach(function (childSnapshot) {
    const index = possibleColours.indexOf(childSnapshot.val().colour);
    if (index > -1) {
      possibleColours.splice(index, 1);
    }
  });
  // assigns colour in array to user
  const userColour = possibleColours[0];

  const userRef = database.ref('/users/' + id);

  userRef.update({
    team: teamid,
    colour: userColour,
  });
}

export const addUserToTeam = (userid, teamid) => {
  const teamRef = database.ref('/teams/' + teamid + '/members/');
  teamRef.update({
    [userid]: 'employee',
  });
};

export const joinTeamWithJoinCode = (userid, joinCode) => {
  database.ref('/joinCodes/' + joinCode).once('value', snapshot => {
    if (snapshot.exists()) {
      addUserToTeam(userid, snapshot.val());
      assignTeamToUser(userid, snapshot.val());
      console.log('tru');
    } else console.log('hey');
  });
};

export async function userIsAdmin(user) {
  const userRef = database.ref('users/' + user.uid);
  let info = await userRef.once('value');
  console.log('type: ' + typeof info.val().isAdmin);
  return info.val().isAdmin;
}

export function createNewTeam(teamName, id) {
  key = database.ref('/teams').push().key;

  // generate join code for the team
  const joinCode = generateTeamCode(key);

  const teamRef = database.ref('/teams/' + key);
  teamRef
    .update({
      name: teamName,
      members: {
        [id]: 'admin',
      },
      joinCode: joinCode,
    })
    .then(() => console.log('Data set.'));
  return key;
}

export const addJoinCodeToList = (joinCode, teamid) => {
  const ref = database.ref('/joinCodes');
  ref
    .update({
      [joinCode]: teamid,
    })
    .then(() => console.log('Join code added to DB.'));
};

export async function submitTimeOff(Id, inputs, status) {
  const user = auth().currentUser;
  const userid = user.uid;
  const userRef = database.ref('/users/' + userid);
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  if (inputs.isAllDay) {
    //change time to include whole day; ie start at 00:00 and end at 23:59
    inputs.starts = formatISO(parseISO(inputs.starts).setHours(0, 0, 0));
    inputs.ends = formatISO(parseISO(inputs.ends).setHours(23, 59, 0));
  }

  return new Promise(function (resolve, reject) {
    let key;
    if (Id != null) {
      //if user exists in the system
      key = Id;
    } else {
      key = database //if user doesnt exist in the system
        .ref()
        .push().key;
    }
    database
      .ref('teams/' + teamid + '/requests/' + key)
      .update(
        Object.assign({}, {Id: key, sender: user.uid, status: status}, inputs),
      )
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function changeRequestStatus(status, id) {
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;
  return new Promise(function (resolve, reject) {
    database
      .ref('teams/' + teamid + '/requests/' + id)
      .update({status: status})
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function submitRegularShift(day, inputs) {
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  return new Promise(function (resolve, reject) {
    let key;
    key = database.ref().push().key;

    database
      .ref('teams/' + teamid + '/regularShifts/' + day + '/' + key)
      .update(Object.assign({}, {Id: key}, inputs))
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}
