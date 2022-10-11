import React from 'react';
import {Calendar} from 'react-native-calendars';

/* Calendar component for Rota tab */
const Rota = ({navigation}) => {
  // design for date markers: not yet implemented due to time constraints
  const preferenceAgainst = {
    key: 'preference-against',
    color: 'red',
  };
  const preferenceFor = {
    key: 'preference-for',
    color: 'green',
  };
  const closed = {
    dots: [],
    selected: true,
    selectedColor: 'grey',
  };
  const onShift = {
    dots: [],
    selected: true,
    selectedColor: 'orange',
  };

  return (
    <>
      <Calendar
        minDate={new Date()}
        onDayPress={daydate => {
          const day = new Date(daydate.dateString).toDateString();
          navigation.navigate('Day', {day: day});
        }}
        firstDay={1}
        enableSwipeMonths={true}
        markingType={'multi-dot'}
      />
    </>
  );
};

export default Rota;
