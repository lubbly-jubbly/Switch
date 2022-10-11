import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import endOfDay from 'date-fns/endOfDay';
import formatISO from 'date-fns/formatISO';
import getDay from 'date-fns/getDay';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import {checkSameDay} from './checkSameDay';
import {splitDates} from './splitDates';
// set up DB variables
const database = firebase
  .app()
  .database(
    'https://calendarauth-b8522-default-rtdb.europe-west1.firebasedatabase.app/',
  );

export async function createRota(startDate, endDate) {
  //array of each day we are assigning shifts for
  const dates = eachDayOfInterval({start: startDate, end: endDate});
  // splitting dates into their respective weeks
  allDates = splitDates(dates);
  // finding the user's team
  const user = auth().currentUser;
  const userid = user.uid;
  const userRef = database.ref('/users/' + userid);
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  // removing previous rota if the current dates overlap --------------------------------------------------------------------------

  const rotaRef = database.ref('/teams/' + teamid + '/rota/');
  const rotaSnapshot = await rotaRef.once('value');
  await Promise.all(
    rotaSnapshot.forEach(function (childSnapshot) {
      let key = childSnapshot.key;

      if (
        areIntervalsOverlapping(
          {
            start: parseISO(childSnapshot.val().starts),
            end: parseISO(childSnapshot.val().ends),
          },
          {start: startOfDay(startDate), end: endOfDay(endDate)},
        )
      ) {
        shiftRef = database.ref('/teams/' + teamid + '/rota/' + key + '/');
        shiftRef.remove();
      }
    }),
  );
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // finding a list of users in that team
  const usersRef = database.ref('/users/');
  const mysnapshot = await usersRef
    .orderByChild('team')
    .equalTo(teamid)
    .once('value');
  const users = [];

  mysnapshot.forEach(function (childSnapshot) {
    users.push(childSnapshot.val());
  });

  // creating a user id look-up object
  const userIds = {};
  users.forEach(user => {
    console.log(user.Id + user.firstname);
    userIds[user['Id']] = user;
  });

  // repeat algorithm for each week the user wishes to generate a rota for.
  async function createRotaForWeek(dates) {
    const shifts = [];
    const daysOfTheWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    await Promise.all(
      dates.map(async date => {
        const dayOfWeek = daysOfTheWeek[getDay(date)];

        const dayRef = database.ref(
          '/teams/' + teamid + '/regularShifts/' + dayOfWeek,
        );

        const mysnapshot = await dayRef.once('value');
        mysnapshot.forEach(function (childSnapshot) {
          // using time from database and given date to obtain the datetime of the shift
          (shiftStart = parseISO(
            formatISO(date, {representation: 'date'}) +
              ' ' +
              formatISO(parseISO(childSnapshot.val().starts), {
                representation: 'time',
              }),
          )),
            (shiftEnd = parseISO(
              formatISO(date, {representation: 'date'}) +
                ' ' +
                formatISO(parseISO(childSnapshot.val().ends), {
                  representation: 'time',
                }),
            )),
            (shiftDetails = {
              starts: shiftStart,
              ends: shiftEnd,
              employeesNeeded: parseInt(childSnapshot.val().employeesNeeded),
            });

          shifts.push(shiftDetails);
        });
      }),
    );

    // get requests
    // for each request, check if it overlaps with any shifts, if it does, add it to the shift's info
    const requestsRef = database.ref('/teams/' + teamid + '/requests/');

    const requests = await requestsRef
      .orderByChild('status')
      .equalTo('accepted')
      .once('value');

    shifts.forEach(shift => {
      shift.absentStaff = [];
      requests.forEach(function (childSnapshot) {
        if (checkSameDay(shift.starts, shift.ends, childSnapshot.val())) {
          absentStaffId = childSnapshot.val().sender;
          shift.absentStaff.push(absentStaffId);
        }
      });

      shift.availableStaff = [];
      users.forEach(user => {
        if (!shift.absentStaff.includes(user.Id)) {
          shift.availableStaff.push(user.Id);
        }
      });
    });

    shifts.forEach(shift => {
      key = database.ref().push().key;

      database.ref('/teams/' + teamid + '/rota/' + key).update({
        starts: formatISO(shift.starts),
        ends: formatISO(shift.ends),
      });

      shift.Id = key;
    });

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //the actual algorithm-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

    // set up variables
    users.forEach(user => {
      user.hours *= dates.length / 7;
      user.hoursRemaining = user.hours;
      user.shifts = [];
    });
    shifts.forEach(shift => {
      shift.employeesNeededRemaining = shift.employeesNeeded;
      shift.assignedEmployees = [];
    });

    let unassignedShifts = 0;
    shifts.forEach(shift => {
      unassignedShifts += shift.employeesNeededRemaining;
    });

    while (unassignedShifts > 0) {
      //find shift where the difference between the number of available employees and the number of employees needed is smallest
      // 1. create an array with the extra staff available for each shift
      let extraStaffNumbers = [];
      let shiftsRemaining = [];
      shifts.forEach(shift => {
        if (shift.employeesNeededRemaining !== 0) {
          extraStaffNumbers.push(
            shift['availableStaff'].length - shift.employeesNeededRemaining,
          );
          shiftsRemaining.push(shift);
        }
      });
      // 2. find the min value of that array and the shift corresponding to that value
      const minDifference = Math.min(...extraStaffNumbers);

      // get the index of every occurence of that value
      function getAllIndexes(arr, val) {
        var indexes = [],
          i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
          indexes.push(i);
        }
        return indexes;
      }
      const indexes = getAllIndexes(extraStaffNumbers, minDifference);

      // choose a random index from the list and find the corresponding shift
      const chosenShift =
        shiftsRemaining[Math.floor(Math.random() * indexes.length)];

      // out of that shift's available employee(s), find employee with most hours remaining
      let availableStaffDetails = [];
      let employeeHoursRemaining = [];

      chosenShift['availableStaff'].forEach(employeeId => {
        users.forEach(user => {
          if (user.Id == employeeId) {
            employeeHoursRemaining.push(user.hoursRemaining);
            availableStaffDetails.push(user);
          }
        });
      });

      const chosenEmployee =
        availableStaffDetails[
          employeeHoursRemaining.indexOf(Math.max(...employeeHoursRemaining))
        ];
      console.log('firstIndex:  ' + availableStaffDetails[0].firstname);
      console.log(chosenEmployee);

      //remove that employee from the list of available shifts for all other shifts that day (an employee cannot work multiple shifts per day)
      shifts.forEach(shift => {
        if (getDay(shift.starts) == getDay(chosenShift.starts)) {
          const index = shift['availableStaff'].indexOf(chosenEmployee.Id);
          if (index > -1) {
            // only splice array when item is found
            shift['availableStaff'].splice(index, 1); // 2nd parameter means remove one item only
          }
        }
      });

      // assign employee to shift

      chosenShift.assignedEmployees.push(chosenEmployee.Id);
      chosenShift.employeesNeededRemaining -= 1;
      chosenEmployee.hoursRemaining -=
        Math.abs(chosenShift.ends - chosenShift.starts) / 36e5;
      chosenEmployee.shifts.push(chosenShift.Id);

      unassignedShifts -= 1;
      console.log(chosenEmployee.shifts);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //loading to database-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

    await Promise.all(
      shifts.map(async shift => {
        database
          .ref('/teams/' + teamid + '/rota/' + shift.Id)
          .update({
            assignedEmployees: shift.assignedEmployees,
          })
          .then(console.log('hellooo'));
      }),
    );
  }
  allDates.forEach(dates => {
    createRotaForWeek(dates);
  });
}
