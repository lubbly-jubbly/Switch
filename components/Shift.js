import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLOURS from '../conts/colours';
import {NEXT, SMALLNEXT} from '../conts/icons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';

/* Shift component for upcoming shifts list displayed on Home tab */
const Shift = ({navigation, shiftDetails}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={() =>
        navigation.navigate('Day', {
          day: parseISO(shiftDetails.starts).toDateString(),
        })
      }>
      <View>
        <Text style={[{color: COLOURS.black}, FONTS.body3]}>
          {format(parseISO(shiftDetails.starts), 'eeee do MMM')}
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[APPSTYLES.timeText, FONTS.body3]}>
            {format(parseISO(shiftDetails.starts), 'p')}
          </Text>
          <SMALLNEXT />
          <Text style={[APPSTYLES.timeText, FONTS.body3]}>
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
