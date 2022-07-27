import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import COLOURS from '../conts/colours';
import formatISO from 'date-fns/formatISO';
import getDate from 'date-fns/getDate';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import {FONTS, SIZES} from '../conts/theme';
import {NEXT, SMALLNEXT} from '../conts/icons';
const Shift = ({navigation, shiftDetails}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={() =>
        navigation.navigate('Day', {
          day: parseISO(shiftDetails['starts']).toDateString(),
        })
      }>
      <View>
        <Text style={[{color: COLOURS.black}, FONTS.body3]}>
          {format(parseISO(shiftDetails.starts), 'eeee do MMM')}
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
            {format(parseISO(shiftDetails.starts), 'p')}
          </Text>
          <SMALLNEXT />
          <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
            {format(parseISO(shiftDetails.ends), 'p')}
          </Text>
        </View>
      </View>
      <NEXT />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,

    width: '100%',
    backgroundColor: COLOURS.light,
    marginVertical: 10,
    padding: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Shift;
