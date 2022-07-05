import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import COLOURS from '../conts/colours';
const RadioButtons = ({childToParent}) => {
  const [value, setValue] = React.useState('first');

  return (
    <View style={styles.container}>
      <RadioButton.Group
        onValueChange={value => {
          setValue(value);
          childToParent(value == 'first');
        }}
        value={value}>
        <RadioButton.Item
          label="I want to create a new team"
          value="first"
          labelStyle={styles.label}
          color={COLOURS.darkBlue}
        />
        <RadioButton.Item
          label="I want to join an existing team"
          value="second"
          labelStyle={styles.label}
          color={COLOURS.darkBlue}
        />
      </RadioButton.Group>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.light,
    marginTop: 20,
    borderRadius: 10,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.grey,
  },
});
export default RadioButtons;
