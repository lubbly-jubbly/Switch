import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import {SIZES} from '../conts/theme';

/* Button used for submit buttons on forms */
const BigButton = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 180,
    backgroundColor: COLOURS.blue,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: SIZES.radius,
  },

  text: {color: COLOURS.white, fontWeight: 'bold', fontSize: 18},
});

export default BigButton;
