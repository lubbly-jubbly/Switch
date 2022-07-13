import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import COLOURS from '../conts/colours';
import {APPSTYLES} from '../conts/theme';
const RadioButtons = ({onValueChange, value}) => {
  // const [value, setValue] = React.useState('first');

  return (
    <View style={styles.container}>
      <Text style={APPSTYLES.inputLabel}>I want to...</Text>
      <View style={styles.itemContainer}>
        <RadioButton.Group onValueChange={onValueChange} value={value}>
          <RadioButton.Item
            label="Create a new team"
            value={true}
            labelStyle={styles.label}
            color={COLOURS.darkBlue}
          />
          <RadioButton.Item
            label="Join an existing team"
            value={false}
            labelStyle={styles.label}
            color={COLOURS.darkBlue}
          />
        </RadioButton.Group>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginVertical: 0,
    fontSize: 14,
    color: COLOURS.grey,
  },
  itemContainer: {
    backgroundColor: COLOURS.light,
    // paddingHorizontal: 15,
    // paddingVertical: 15,
    borderRadius: 10,
  },
});
export default RadioButtons;
