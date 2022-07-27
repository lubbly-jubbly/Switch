import React from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {generateTeamCode} from './teamCodes';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import getDay from 'date-fns/getDay';
import {checkSameDay} from './screens/Day';
import {submitRota} from './apiService';

// set up DB variables
const database = firebase
  .app()
  .database(
    'https://calendarauth-b8522-default-rtdb.europe-west1.firebasedatabase.app/',
  );

export async function createRota(startDate, endDate) {
  //array of each day we are assigning shifts for
  const dates = eachDayOfInterval({start: startDate, end: endDate});

  // finding the user's team
  const user = auth().currentUser;
  const userid = user.uid;
  const userRef = database.ref('/users/' + userid);
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;

  // TEMPORARY: removing previous rota --------------------------------------------------------------------------
  const tempUsersRef = database.ref('/users/');
  const tempSnapshot = await tempUsersRef
    .orderByChild('team')
    .equalTo(teamid)
    .once('value');
  const tempUsers = [];

  tempSnapshot.forEach(function (childSnapshot) {
    tempUsers.push(childSnapshot.val());
  });
  await Promise.all(
    database.ref('/teams/' + teamid + '/rota/').remove(),

    tempUsers.map(async user => {
      database.ref('/users/' + user.Id + '/' + 'shifts').remove();
    }),
  );
  // end of temp section

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

  // list of shifts
  //   const shiftsRef = database.ref('/teams/' + teamid + '/regularShifts/');
  //   const regularShifts = await shiftsRef.once('value');
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
  // for each request, check if it overlaps with any shifts, if it does- add it to the shift's info
  const requestsRef = database.ref('/teams/' + teamid + '/requests/');

  const requests = await requestsRef
    .orderByChild('status')
    .equalTo('accepted')
    .once('value');

  shifts.forEach(shift => {
    shift.absentStaff = [];
    requests.forEach(function (childSnapshot) {
      if (checkSameDay(shift.starts, shift.ends, childSnapshot.val())) {
        console.log(
          shift.starts + 'absent girly is: ' + childSnapshot.val().sender,
        );
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

  // await Promise.all(
  //   shifts.map(async shift => {
  shifts.forEach(shift => {
    key = database //if user doesnt exist in the system,
      .ref()
      .push().key;

    database.ref('/teams/' + teamid + '/rota/' + key).update({
      // assignedEmployees: shift.assignedEmployees,
      starts: formatISO(shift.starts),
      ends: formatISO(shift.ends),
    });

    shift.Id = key;
  });
  // }),
  // );

  // find total employee hours
  let employeeHours = 0;
  users.forEach(user => {
    employeeHours += user.hours;
  });

  //find total shift hours
  let shiftHours = 0;
  shifts.forEach(shift => {
    shiftHours +=
      (Math.abs(shift.ends - shift.starts) / 36e5) * shift.employeesNeeded;
  });

  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //the actual algorithm-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

  // set up variables
  users.forEach(user => {
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
    const chosenShift =
      shiftsRemaining[
        extraStaffNumbers.indexOf(Math.min(...extraStaffNumbers))
      ];
    console.log(chosenShift);
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
    console.log('available staff: ' + availableStaffDetails);
    console.log('emp hrs: ' + employeeHoursRemaining);
    console.log('this is indexed.... ' + Math.max(...employeeHoursRemaining));
    console.log(
      'this is REALLY indexed.... ' + employeeHoursRemaining.indexOf(22),
    );

    const chosenEmployee =
      availableStaffDetails[
        employeeHoursRemaining.indexOf(Math.max(...employeeHoursRemaining))
      ];
    console.log('firstIndex:  ' + availableStaffDetails[0].firstname);
    console.log(chosenEmployee);
    //

    //  shifts.forEach(shift => {
    //   // if there is another shift that day that ONLY that employee can work
    //       if (getDay(shift.starts) == getDay(chosenShift.starts) && availableStaff == [chosenEmployee]) {

    //       }
    //     });

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
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //loading to database-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

  // console.log(shifts);
  // users.forEach(user => {
  //   console.log(user.firstname + user.hoursRemaining);
  // });

  await Promise.all(
    shifts.map(async shift => {
      database
        .ref('/teams/' + teamid + '/rota/' + shift.Id)
        .update({
          assignedEmployees: shift.assignedEmployees,
        })
        .then(console.log('hellooo'));
    }),

    users.map(async user => {
      database
        .ref('/users/' + user.Id + '/')
        .update({
          shifts: user.shifts,
        })
        .then(console.log('hellooo'));
    }),
  );
}
