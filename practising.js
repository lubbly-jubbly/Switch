import eachDayOfInterval from 'date-fns/eachDayOfInterval';

const startDate = new Date('2022-08-16');
const endDate = new Date('2022-08-30');
const dates = eachDayOfInterval({start: startDate, end: endDate});
// console.log(dates);
console.log(dates.slice(0, 8 - getDay(startDate)));
dates.slice();
console.log(getDay(endDate));
