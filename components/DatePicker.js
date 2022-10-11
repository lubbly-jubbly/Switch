import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatISO} from 'date-fns';

/* Date and time picker form field */
const DatePicker = ({label, timeRequired, dateToParent}) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  async function onChangeTime(event, value) {
    await setTime(value);
    // Sends chosen date to parent form
    dateToParent(formatDate());
  }

  async function onChangeDate(event, value) {
    await setDate(value);
    // Sends chosen date to parent form
    dateToParent(formatDate());
  }

  /* Takes the date part of the date input and the time part 
of the time input and combines them into one date. */
  formatDate = () => {
    const mydate =
      formatISO(date, {representation: 'date'}) +
      ' ' +
      formatISO(time, {representation: 'time'});
    return mydate;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        {timeRequired ? (
          <DateTimePicker
            value={time}
            mode="time"
            style={{width: 100}}
            onChange={onChangeTime}
          />
        ) : null}
        <DateTimePicker
          value={date}
          style={{width: 125}}
          onChange={onChangeDate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.blue,
  },
  container: {
    height: 55,
    backgroundColor: COLOURS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    // borderWidth: 0.5,
    marginBottom: 20,
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default DatePicker;
