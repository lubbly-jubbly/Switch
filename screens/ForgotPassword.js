import React from 'react';
import {Text, View, SafeAreaView, Keyboard} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import COLOURS from '../conts/colours';
import auth from '@react-native-firebase/auth';

const ForgotPassword = () => {
  const [inputs, setInputs] = React.useState({email: ''});
  const [errors, setErrors] = React.useState({});

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

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView style={{backgroundColor: COLOURS.white, flex: 1}}>
      <View style={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={{color: COLOURS.black, fontSize: 40, fontWeight: 'bold'}}>
          Reset Password
        </Text>
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            value={inputs.email}
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Button title="Send password reset email" onPress={validate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;