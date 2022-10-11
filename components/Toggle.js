import React, {useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import COLOURS from '../conts/colours';

/* Toggle component used in forms. */
const Toggle = ({label, childToParent}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    childToParent(!isEnabled);
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: COLOURS.light,
          alignItems: 'center',
          marginBottom: 20,
        },
      ]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{false: COLOURS.red, true: '#81b0ff'}}
        thumbColor={isEnabled ? COLOURS.light : COLOURS.light}
        ios_backgroundColor={COLOURS.light}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.blue,
  },
  container: {
    height: 55,
    backgroundColor: COLOURS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.5,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
});

export default Toggle;
