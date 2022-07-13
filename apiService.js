import React from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {generateTeamCode} from './teamCodes';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import {USERCOLOURS} from './conts/colours';
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
      key = database //if user doesnt exist in the system,
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

export const addUserDetails = (fname, lname, id, isAdmin, phone, email) => {
  database
    .ref('/users/')
    .update({
      [id]: {
        firstname: fname,
        lastname: lname,
        isAdmin: isAdmin,
        team: '',
        Id: id,
        phone: phone,
        email: email,
      },
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
  const userRef = database.ref('/users/' + id);

  const membersRef = database.ref('/teams/' + teamid + '/members/');

  const snapshot = await membersRef.once('value');
  const numMembers = snapshot.numChildren();
  const userColour = USERCOLOURS[numMembers - 1];
  userRef
    .update({
      team: teamid,
      colour: userColour,
    })
    .then(() => console.log('Data set.'));
}

export const addUserToTeam = (userid, teamid) => {
  const teamRef = database.ref('/teams/' + teamid + '/members/');
  teamRef
    .update({
      [userid]: 'employee',
    })
    .then(() => console.log('Data set.'));
};

export const joinTeamWithJoinCode = (userid, joinCode) => {
  database
    .ref('/joinCodes/' + joinCode)
    .once('value', snapshot => {
      addUserToTeam(userid, snapshot.val());
      assignTeamToUser(userid, snapshot.val());
    })
    .then(console.log('team joined.'));
};

export async function userIsAdmin(user) {
  const userRef = database.ref('users/' + user.uid);
  let info = await userRef.once('value');
  console.log('type: ' + typeof info.val().isAdmin);
  return info.val().isAdmin;
}

// export async function getUserInfo(user) {
//   const userRef = database.ref('users/' + user.uid);
//   const info = await userRef.once('value').then(snapshot => {
//     return snapshot.val();
//   });
//   console.log('in fn ' + info);
//   return info;
// }

export function createNewTeam(teamName, id) {
  key = database //if user doesnt exist in the system,
    .ref('/teams')
    .push().key;
  console.log(key);
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

export async function submitTimeOffRequest(Id, inputs) {
  const user = auth().currentUser;
  const userid = user.uid;
  const userRef = database.ref('/users/' + userid);
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  if (inputs.isAllDay) {
    //change time to include whole day; ie start at 00:00 and end at 23:59
    inputs.starts = formatISO(parseISO(inputs.starts).setHours(0, 0, 0));
    inputs.ends = formatISO(parseISO(inputs.ends).setHours(23, 59, 0));
    console.log('end dateeee' + inputs.starts + inputs.ends);
  }

  return new Promise(function (resolve, reject) {
    let key;
    if (Id != null) {
      //if user exists in the system
      key = Id;
    } else {
      key = database //if user doesnt exist in the system,
        .ref()
        .push().key;
    }
    database
      .ref('teams/' + teamid + '/requests/' + key)
      .update(
        Object.assign(
          {},
          {Id: key, sender: user.uid, status: 'pending'},
          inputs,
        ),
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

// export async function getUserInfo(userInfoRetrieved) {
//   const userInfo = {};
//   const snapshot = await userRef.once('value');
//   userInfo = snapshot.val();
//   userInfoRetrieved(userInfo);
// }

export async function submitRegularShift(day, inputs) {
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  // database.ref('teams/' + teamid + '/regularShifts/' + day).update({
  //   [day]: inputs,
  // });

  return new Promise(function (resolve, reject) {
    let key;
    key = database //if user doesnt exist in the system,
      .ref()
      .push().key;

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

export async function getTotalHours() {
  const user = auth().currentUser;
  const userid = user.uid;
  const userRef = database.ref('/users/' + userid);
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  let totalHrs = 0;
  const users = await database
    .ref('/users/')
    .orderByChild('team')
    .equalTo(teamid)
    .once('value');

  users.forEach(function (childSnapshot) {
    totalHrs += childSnapshot.val().hours;
  });
  setTotalHours(totalHrs);
}

export function submitRota() {
  database
    .ref('/users/' + '3yzkuik0pFhS0XobkdDasubGxz42' + '/')
    .update({
      firstname: 'bob',
    })
    .then(() => console.log('hellooo'));
}

export function assignColourToUser() {
  //navigate to user
  //
  database.ref();
}
