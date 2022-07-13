import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import COLOURS from '../conts/colours';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns/format';
import {formatISO} from 'date-fns';

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
    // borderWidth: 0.5,
    marginBottom: 20,
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default TimePicker;
