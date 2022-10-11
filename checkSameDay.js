import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import parseISO from 'date-fns/parseISO';

/* Function that checks whether an absence/shift overlaps with a day.
Takes in the start of that day, the end of that day and an item, 
which is an absence/shift with a starts, ends and repeat property.
If the item does repeat, it checks the if any of the next 100 occurences 
of the absence overlap with the day. */
export const checkSameDay = (startOfDay, endOfDay, item) => {
  const itemStartDate = parseISO(item.starts);
  const itemEndDate = parseISO(item.ends);

  /* Nested function that checks for the next 100 occurences of the absence, 
  given the absence's repeat interval. */
  const checkRepeats = interval => {
    for (let i = 0; i < 100; i++) {
      if (
        areIntervalsOverlapping(
          {start: itemStartDate, end: itemEndDate},
          {start: startOfDay, end: endOfDay},
        )
      ) {
        return true;
      }
      itemStartDate.setDate(itemStartDate.getDate() + interval);
      itemEndDate.setDate(itemEndDate.getDate() + interval);
    }
    return false;
  };

  /* Switch that goes through each possible repeat option. */
  switch (item.repeat) {
    case 'never':
      return areIntervalsOverlapping(
        {start: parseISO(item.starts), end: parseISO(item.ends)},
        {start: startOfDay, end: endOfDay},
      );
    case 'daily':
      return checkRepeats(1);
    case 'weekly':
      return checkRepeats(7);
    case 'fortnightly':
      return checkRepeats(14);
    case 'monthly':
      for (let i = 0; i < 50; i++) {
        itemStartDate.setMonth(itemStartDate.getMonth() + 1);
        itemEndDate.setMonth(itemEndDate.getMonth() + 1);

        if (
          areIntervalsOverlapping(
            {start: itemStartDate, end: itemEndDate},
            {start: startOfDay, end: endOfDay},
          )
        ) {
          return true;
        }
      }
      return false;
  }
};
