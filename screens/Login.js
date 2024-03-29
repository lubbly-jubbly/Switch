import auth from '@react-native-firebase/auth';
import React from 'react';
import {Keyboard, SafeAreaView, Text, View} from 'react-native';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import COLOURS from '../conts/colours';
import {FONTS} from '../conts/theme';

/* Login screen. */
const Login = ({navigation}) => {
  const [inputs, setInputs] = React.useState({email: '', password: ''});
  const [errors, setErrors] = React.useState({});

  /* Called if validate is successful. Authenticates user. */
  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(inputs.email, inputs.password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
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
        if (error.code === 'auth/wrong-password') {
          handleError('Incorrect email or password.', 'password');
        }

        if (error.code === 'auth/too-many-requests') {
          handleError(
            'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
            'password',
          );
        }
        console.error(error);
      });
  };

  /* Called when the user presses submit button. Checks that all fields are
   filled out. */
  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please enter your email address.', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please enter your password.', 'password');
      isValid = false;
    }
    if (isValid) {
      handleLogin();
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
      <View
        style={{
          paddingVertical: 70,
          paddingHorizontal: 20,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1,
        }}>
        <View style={{}}>
          <Text style={FONTS.h1}>Welcome back!</Text>
          <Text style={FONTS.h2}>Enter Your Details to log in.</Text>
        </View>
        <View style={{marginTop: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-outline"
            iconFocused="mail"
            label="Email"
            value={inputs.email}
            placeholder="Enter your email address"
            // placeholderStyle={{color: COLOURS.red}}
            error={errors.email}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-closed-outline"
            iconFocused="lock-closed"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            value={inputs.password}
            password
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <BigButton title="Log In" onPress={validate} />

          <Text
            style={[FONTS.smallBlue, {paddingBottom: 20}]}
            onPress={() => navigation.navigate('ForgotPassword')}>
            Forgot Password
          </Text>
          <Text style={{fontSize: 16}}>
            {' '}
            First time here?{' '}
            <Text
              onPress={() => navigation.navigate('Signup')}
              style={FONTS.smallBlue}>
              Create an account
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
