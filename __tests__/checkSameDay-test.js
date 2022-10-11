import {checkSameDay} from '../checkSameDay';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import parseISO from 'date-fns/parseISO';
import {formatISO} from 'date-fns';

// Checks that the checkSameDay returns true for a one-off absence tested with a day that overlaps with the absence.
const request1 = {
  starts: formatISO(parseISO('2014-02-11T11:30:30')),
  ends: formatISO(parseISO('2014-02-18T11:30:30')),
  repeat: 'never',
};
test('same day with no repeats', () => {
  expect(
    checkSameDay(
      startOfDay(parseISO('2014-02-11T11:30:30')),
      endOfDay(parseISO('2014-02-11T11:30:30')),
      request1,
    ),
  ).toBe(true);
});

// Checks that the checkSameDay returns true for a one-off absence tested with a day that doesn't overlap with the absence.
const request2 = {
  starts: formatISO(parseISO('2014-02-11T11:30:30')),
  ends: formatISO(parseISO('2014-02-18T11:30:30')),
  repeat: 'never',
};
test('same day with no repeats', () => {
  expect(
    checkSameDay(
      startOfDay(parseISO('2014-02-10T11:30:30')),
      endOfDay(parseISO('2014-02-10T11:30:30')),
      request2,
    ),
  ).toBe(false);
});

// Checks that the checkSameDay returns true for a weekly absence tested with a day a week later.
const request3 = {
  starts: formatISO(parseISO('2014-02-04T11:30:30')),
  ends: formatISO(parseISO('2014-02-04T12:30:30')),
  repeat: 'weekly',
};
test('same day with weekly repeat', () => {
  expect(
    checkSameDay(
      startOfDay(parseISO('2014-02-11T11:30:30')),
      endOfDay(parseISO('2014-02-11T11:30:30')),
      request3,
    ),
  ).toBe(true);
});

// Checks that the checkSameDay returns false for a weekly absence tested with a day that doesn't overlap with the absence or its repeats.
const request4 = {
  starts: formatISO(parseISO('2014-02-03T11:30:30')),
  ends: formatISO(parseISO('2014-02-03T12:30:30')),
  repeat: 'weekly',
};
test('same day with weekly repeat', () => {
  expect(
    checkSameDay(
      startOfDay(parseISO('2014-02-11T11:30:30')),
      endOfDay(parseISO('2014-02-11T11:30:30')),
      request4,
    ),
  ).toBe(false);
});

// Checks that the checkSameDay returns true for a monthly absence tested with a day a month later.
const request5 = {
  starts: formatISO(parseISO('2014-03-11T11:30:30')),
  ends: formatISO(parseISO('2014-03-11T12:30:30')),
  repeat: 'monthly',
};
test('same day with monthly repeat', () => {
  expect(
    checkSameDay(
      startOfDay(parseISO('2014-02-11T11:30:30')),
      endOfDay(parseISO('2014-02-11T11:30:30')),
      request5,
    ),
  ).toBe(false);
});
