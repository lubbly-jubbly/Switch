import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import DropDownPicker from 'react-native-dropdown-picker';

/* Repeat picker dropdown for requesting/selecting time off forms */
const RepeatPicker = ({...props}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Never repeat', value: 'never'},
    {label: 'Repeat every day', value: 'daily'},
    {label: 'Repeat every week', value: 'weekly'},
    {label: 'Repeat every 2 weeks', value: 'fortnightly'},
    {label: 'Repeat every month', value: 'monthly'},
  ]);

  return (
    <DropDownPicker
      style={{
        backgroundColor: COLOURS.light,
        borderColor: COLOURS.light,
        borderRadius: 10,
      }}
      containerStyle={{}}
      dropDownContainerStyle={styles.dropdown}
      arrowIconStyle={styles.arrow}
      textStyle={styles.label}
      placeholder="Repeat"
      placeholderStyle={styles.label}
      open={open}
      items={items}
      setOpen={setOpen}
      setItems={setItems}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.blue,
  },
  dropdown: {
    backgroundColor: COLOURS.light,
    borderColor: COLOURS.grey,
  },
  arrow: {
    color: COLOURS.grey,
  },
});

export default RepeatPicker;
