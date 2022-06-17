import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import COLOURS from '../conts/colours';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({label, timeRequired}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        {timeRequired ? (
          <DateTimePicker value={new Date()} mode="time" style={{width: 100}} />
        ) : null}
        <DateTimePicker value={new Date()} style={{width: 90}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.grey,
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
  },
});

export default DatePicker;
