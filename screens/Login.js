import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import COLOURS from '../conts/colours';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import Loader from '../components/Loader';
import auth from '@react-native-firebase/auth';
import {APPSTYLES, FONTS} from '../conts/theme';

const Login = ({navigation}) => {
  const [inputs, setInputs] = React.useState({email: '', password: ''});
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

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

  // const login = () => {
  //   setLoading(true);
  //   setTimeout(async () => {
  //     setLoading(false);
  //     let userData = await AsyncStorage.getItem('userData');
  //     if (userData) {
  //       userData = JSON.parse(userData);
  //       if (
  //         inputs.email == userData.email &&
  //         inputs.password == userData.password
  //       ) {
  //         navigation.navigate('HomeScreen');
  //         AsyncStorage.setItem(
  //           'userData',
  //           JSON.stringify({...userData, loggedIn: true}),
  //         );
  //       } else {
  //         Alert.alert('Error', 'Invalid Details');
  //       }
  //     } else {
  //       Alert.alert('Error', 'User does not exist');
  //     }
  //   }, 3000);
  // };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  return (
    <SafeAreaView style={{backgroundColor: COLOURS.white, flex: 1}}>
      <Loader visible={loading} />
      <View style={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={FONTS.h1}>Welcome back!</Text>
        <Text style={FONTS.h2}>Enter Your Details to log in.</Text>

        <View style={{marginVertical: 20}}>
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
          <BigButton title="Log In" onPress={validate} />

          <View style={{alignItems: 'center'}}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  link: {
    color: '#0000EE',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;
