import {addJoinCodeToList} from './apiService';
import {database} from './apiService';
export const usedTeamCodes = [];

/* Function that generates a random 6-digit team code and 
checks the existing team code in the database to ensure it is unique. */
export function generateTeamCode(teamid) {
  // Generating team code
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let newCode = '';
  for (let i = 0; i < 6; i++) {
    newCode += characters[Math.floor(Math.random() * (characters.length - 1))];
  }

  // Checking database
  database.ref('/joinCodes/').once('value', snapshot => {
    for (key in snapshot.val()) {
      if (newCode === key) {
        generateTeamCode(); // Function repeated if join code already exists in the database
      }
    }
  }),
    // Adds join code to database
    addJoinCodeToList(newCode, teamid);
  return newCode;
}
