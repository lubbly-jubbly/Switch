import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
const Input = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{marginBottom: 20}}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error
              ? COLOURS.red
              : isFocused
              ? COLOURS.darkBlue
              : COLOURS.light,
            alignItems: 'center',
          },
        ]}>
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{color: COLOURS.darkBlue, flex: 1}}
          {...props}
        />
        {password}
      </View>
      {error && (
        <Text style={{marginTop: 7, color: COLOURS.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLOURS.grey,
  },
  inputContainer: {
    height: 55,
    backgroundColor: COLOURS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.5,
  },
});

export default Input;
