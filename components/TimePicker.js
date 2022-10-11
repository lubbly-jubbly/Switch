import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import COLOURS from '../conts/colours';

/* Time picker form field */
const TimePicker = ({label, ...props}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        <DateTimePicker mode="time" style={{width: 100}} {...props} />
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
    height: 45,
    backgroundColor: COLOURS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default TimePicker;
