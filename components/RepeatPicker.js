import React, {useState} from 'react';

import {View, StyleSheet} from 'react-native';

import COLOURS from '../conts/colours';
import DropDownPicker from 'react-native-dropdown-picker';

const RepeatPicker = ({...props}) => {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Never repeat', value: 'never'},
    {label: 'Repeat every day', value: 'daily'},
    {label: 'Repeat every week', value: 'weekly'},
    {label: 'Repeat every 2 weeks', value: 'fortnightly'},
    {label: 'Repeat every month', value: 'monthly'},
  ]);

  // console.log(value);
  // const onChangeRepeat = hi => {
  //   setValue(hi),
  //     () => {
  //       console.log(value);
  //     };
  //   // console.log(value);
  //   // repeatToParent(getRepeat());
  // };

  // function getRepeat() {
  //   return value;
  // }

  return (
    <DropDownPicker
      style={{
        backgroundColor: COLOURS.light,
        borderColor: COLOURS.light,
        borderRadius: 10,
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
});
export default RepeatPicker;
