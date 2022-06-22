import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';

const Shift = ({navigation, day}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={() => navigation.navigate('Day', {day: day.toDateString()})}>
      <Text style={{color: COLOURS.black, fontSize: 18}}>
        {day.toDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    width: '100%',
    backgroundColor: COLOURS.light,
    marginVertical: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Shift;
