import React from 'react';
import {Text, View} from 'react-native';
import COLOURS from '../conts/colours';
import {SIZES} from '../conts/theme';

/* Name component with background corresponding to user's assigned colour. */
const UserName = ({name, colour}) => {
  return (
    <View style={{backgroundColor: colour, borderRadius: 10, marginRight: 8}}>
      <Text
        style={{
          color: COLOURS.white,
          padding: 5,
          fontWeight: '600',
          fontSize: SIZES.h3,
        }}>
        {name}
      </Text>
    </View>
  );
};
export default UserName;
