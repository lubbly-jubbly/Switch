import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();
const Input = ({
  label,
  iconName,
  error,
  password,
  value,
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
        <Icon
          name={iconName}
          style={{color: COLOURS.darkBlue, fontSize: 22, marginRight: 10}}
        />
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
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            style={{color: COLOURS.darkBlue, fontSize: 22}}
          />
        )}
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
    justifyContent: 'flex-start',
    borderRadius: 10,
  },
});

export default Input;
