import auth from '@react-native-firebase/auth';
import React from 'react';
import {Keyboard, SafeAreaView, Text, View} from 'react-native';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import COLOURS from '../conts/colours';
import {FONTS} from '../conts/theme';

/* Forgot password screen. */
const ForgotPassword = () => {
  const [inputs, setInputs] = React.useState({email: ''});
  const [errors, setErrors] = React.useState({});

  /* Called if validate is successful. Sends user password reset email. */
  const handlePasswordReset = Email => {
    auth()
      .sendPasswordResetEmail(Email, null)
      .then(() => {
        alert('Success! A reset email has been sent to ' + Email + '.');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          handleError('Please enter a valid email address.', 'email');
        }

        if (error.code === 'auth/user-not-found') {
          handleError(
            'This email address is not associated with an account.',
            'email',
          );
        }
      })

      .catch(function (e) {
        console.log(e);
      });
  };

  /* Called when the user presses submit button. Checks that field is filled out. */
  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (isValid) {
      handlePasswordReset(inputs.email);
    }
  };

  /* Called when user edits a field. Adds input to inputs state variable. */
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  /* Called by validate. Adds error to errors state variable in order to notify user of error. */
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView style={{backgroundColor: COLOURS.white, flex: 1}}>
      <View style={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={FONTS.h1}>Reset your password</Text>
        <Text style={FONTS.h2}>
          Enter your email and we'll send you a link to reset your password.
        </Text>
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-outline"
            iconFocused="mail"
            label="Email"
            value={inputs.email}
            placeholder="Enter your email address"
            error={errors.email}
          />
          <BigButton title="Email me" onPress={validate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
