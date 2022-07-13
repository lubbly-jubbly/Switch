import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLOURS from '../conts/colours';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {APPSTYLES} from '../conts/theme';
Icon.loadFont();
Entypo.loadFont();
const Input = ({
  label,
  iconName,
  iconFocused,
  error,
  password,
  entypo,
  value,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{marginBottom: 20}}>
      <Text style={APPSTYLES.inputLabel}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          APPSTYLES.itemContainer,
          {
            borderColor: error
              ? COLOURS.red
              : isFocused
              ? COLOURS.blue
              : COLOURS.light,
            alignItems: 'center',
          },
        ]}>
        {entypo ? (
          <Entypo
            name={iconName}
            style={{
              color: isFocused ? COLOURS.blue : COLOURS.paleGreen,
              fontSize: 22,
              marginRight: 10,
            }}
          />
        ) : isFocused ? (
          <Icon
            name={iconFocused}
            style={{
              color: COLOURS.blue,
              fontSize: 22,
              marginRight: 10,
            }}
          />
        ) : (
          <Icon
            name={iconName}
            style={{
              color: isFocused ? COLOURS.blue : COLOURS.paleGreen,
              fontSize: 22,
              marginRight: 10,
            }}
          />
        )}
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{color: COLOURS.blue, flex: 1}}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            style={{
              color: isFocused ? COLOURS.blue : COLOURS.paleGreen,
              fontSize: 22,
            }}
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
  inputContainer: {
    // height: 55,
    flexDirection: 'row',
    borderWidth: 0.5,
    justifyContent: 'flex-start',
  },
});

export default Input;
