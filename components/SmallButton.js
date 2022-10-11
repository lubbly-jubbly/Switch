import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import COLOURS from '../conts/colours';
import {SIZES} from '../conts/theme';

/* Small button component displayed in modals. */
export const SmallButton = ({title, onPress = () => {}}) => {
  return (
    <Pressable style={[styles.button, styles.buttonClose]} onPress={onPress}>
      <Text style={styles.textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    borderRadius: SIZES.radius,
    padding: 10,
    elevation: 2,
    marginHorizontal: 7,
  },
  buttonClose: {
    backgroundColor: COLOURS.blue,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
