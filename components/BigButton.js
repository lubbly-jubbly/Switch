import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import COLOURS from '../conts/colours';
import {SIZES} from '../conts/theme';
const BigButton = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 50,
        width: 180,
        backgroundColor: COLOURS.blue,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: SIZES.radius,
      }}>
      <Text style={{color: COLOURS.white, fontWeight: 'bold', fontSize: 18}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BigButton;
