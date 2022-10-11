import getDay from 'date-fns/getDay';

/* This function splits an array of dates into their respective weeks,
and returns an array of arrays containing the dates in each respective week.
 */
export function splitDates(dates) {
  const startDate = dates[0];
  const allDates = [];
  let firstSplice;
  getDay(startDate) === 0 // gets the day of the week of the first date in the array
    ? (firstSplice = 1) // allowing for sunday being taken as day 0 rather than monday
    : (firstSplice = 8 - getDay(startDate));
  allDates.push(dates.splice(0, firstSplice));
  while (dates.length > 7) {
    allDates.push(dates.splice(0, 7));
  }
  allDates.push(dates);
  return allDates;
}
