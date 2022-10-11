import {splitDates} from '../splitDates';
import parseISO from 'date-fns/parseISO';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';

// dates in same week
startDate1 = parseISO('2022-08-11T11:30:30');
endDate1 = parseISO('2022-08-13T11:30:30');
const dates1 = eachDayOfInterval({start: startDate1, end: endDate1});

test('split dates in same week', () => {
  expect(splitDates(dates1)).toEqual([
    eachDayOfInterval({start: startDate1, end: endDate1}),
    [],
  ]);
});

// dates over two weeks
startDate2 = parseISO('2022-08-11T11:30:30');
endDate2 = parseISO('2022-08-17T11:30:30');
const dates2 = eachDayOfInterval({start: startDate2, end: endDate2});

test('split dates over two weeks', () => {
  expect(splitDates(dates2)).toEqual([
    eachDayOfInterval({
      start: startDate2,
      end: parseISO('2022-08-14T11:30:30'),
    }),
    eachDayOfInterval({start: parseISO('2022-08-15T11:30:30'), end: endDate2}),
  ]);
});

// dates over three weeks
startDate3 = parseISO('2022-08-08T11:30:30');
endDate3 = parseISO('2022-08-24T11:30:30');
const dates3 = eachDayOfInterval({start: startDate3, end: endDate3});

test('split dates over three weeks', () => {
  expect(splitDates(dates3)).toEqual([
    eachDayOfInterval({
      start: startDate3,
      end: parseISO('2022-08-14T11:30:30'),
    }),
    eachDayOfInterval({
      start: parseISO('2022-08-15T11:30:30'),
      end: parseISO('2022-08-21T11:30:30'),
    }),
    eachDayOfInterval({start: parseISO('2022-08-22T11:30:30'), end: endDate3}),
  ]);
});
