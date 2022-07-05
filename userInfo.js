import React from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {generateTeamCode} from './teamCodes';

export const database = firebase
  .app()
  .database(
    'https://calendarauth-b8522-default-rtdb.europe-west1.firebasedatabase.app/',
  );
export const user = auth().currentUser;
export const userid = user.uid;
export const userRef = database.ref('/users/' + userid);

export async function getUserInfo() {
  const userInfo = await userRef.once('value');
  return userInfo.val();
}

export async function getUserTeam() {
  const userInfo = await userRef.once('value');
  const teamid = userInfo.val().team;
  console.log(teamid);
}
