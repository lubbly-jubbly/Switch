import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import formatISO from 'date-fns/formatISO';
import getDate from 'date-fns/getDate';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import {SIZES} from '../conts/theme';
const Shift = ({navigation, shiftDetails}) => {
  return (
    // <TouchableOpacity
    //   activeOpacity={0.7}
    //   style={styles.button}
    //   onPress={() => navigation.navigate('Day', {day: day.toDateString()})}>
    //   <Text style={{color: COLOURS.black, fontSize: 18}}>
    //     {day.toDateString()}
    //   </Text>
    // </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={() =>
        navigation.navigate('Day', {
          day: parseISO(shiftDetails['starts']).toDateString(),
        })
      }>
      <Text style={{color: COLOURS.black, fontSize: 18}}>
        {format(parseISO(shiftDetails.starts), 'eeee do MMM')}
      </Text>
      <Text style={{color: COLOURS.black, fontSize: 18}}>
        {format(parseISO(shiftDetails.starts), 'p')} -{' '}
        {format(parseISO(shiftDetails.ends), 'p')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,

    width: '100%',
    backgroundColor: COLOURS.light,
    marginVertical: 10,
    padding: 10,
    justifyContent: 'center',
  },
});

export default Shift;
