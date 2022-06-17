import React, {useState} from 'react';

import {View, StyleSheet} from 'react-native';

import COLOURS from '../conts/colours';
import DropDownPicker from 'react-native-dropdown-picker';

const RepeatPicker = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Never repeat', value: 'never'},
    {label: 'Daily repeat', value: 'daily'},
    {label: 'Weekly repeat', value: 'weekly'},
    {label: 'Monthly repeat', value: 'monthly'},
  ]);

  return (
    <DropDownPicker
      style={{
        backgroundColor: COLOURS.light,
        borderColor: COLOURS.light,
        borderRadius: 0,
      }}
      containerStyle={{}}
      dropDownContainerStyle={{
        backgroundColor: COLOURS.light,
        borderColor: COLOURS.grey,
      }}
      arrowIconStyle={{
        color: COLOURS.grey,
      }}
      textStyle={styles.label}
      placeholder="Repeat"
      placeholderStyle={styles.label}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.grey,
  },
});
export default RepeatPicker;
