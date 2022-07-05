import {addJoinCodeToList} from './apiService';
export const usedTeamCodes = [];

export function generateTeamCode(teamid) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  newCode = '';
  for (i = 0; i < 6; i++) {
    newCode += characters[Math.floor(Math.random() * (characters.length - 1))];
  }

  usedTeamCodes.forEach(function (code) {
    if (newCode == code) {
      generateTeamCode();
    }
  });

  // usedTeamCodes.push(newCode);
  addJoinCodeToList(newCode, teamid);
  return newCode;
}
//need to add it to list of join codes - get team id
//check through list of join codes
