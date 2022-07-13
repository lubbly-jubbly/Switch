import React from 'react';
import {View, Text} from 'react-native';
import COLOURS from '../conts/colours';

export const UserName = ({name, colour}) => {
  return (
    <View style={{backgroundColor: colour, borderRadius: 12}}>
      <Text style={{color: COLOURS.white, padding: 5, fontWeight: '600'}}>
        {name}
      </Text>
    </View>
  );
};
