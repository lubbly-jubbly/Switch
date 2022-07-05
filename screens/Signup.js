// import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import COLOURS from '../conts/colours';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import auth from '@react-native-firebase/auth';
import RadioButtons from '../components/RadioButtons';
import {addUserDetails} from '../apiService';
const Signup = ({navigation}) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    fullname: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const childToParent = isAdmin => {
    setIsAdmin(isAdmin);
  };
  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(inputs.email, inputs.password)
      .then(() => {
        const user = auth().currentUser;
        addUserDetails(inputs.firstname, inputs.lastname, user.uid, isAdmin);
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          handleError('This email address is already in use.', 'email');
        }

        if (error.code === 'auth/invalid-email') {
          handleError('This email address is invalid.', 'email');
        }

        if (error.code === 'auth/weak-password') {
          handleError(
            'Your password must be at least 6 characters.',
            'password',
          );
        }

        console.error(error);
      });
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please enter your email address.', 'email');
      isValid = false;
    }

    if (!inputs.firstname) {
      handleError('Please enter your first name.', 'firstname');
      isValid = false;
    }
    if (!inputs.lastname) {
      handleError('Please enter your last name.', 'lastname');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please enter your phone number.', 'phone');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please enter a password.', 'password');
      isValid = false;
    }

    if (isValid) {
      handleSignUp();
    }
  };

  // const register = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     try {
  //       setLoading(false);
  //       AsyncStorage.setItem('userData', JSON.stringify(inputs));
  //       navigation.navigate('LoginScreen');
  //     } catch (error) {
  //       Alert.alert('Error', 'Something went wrong');
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
      <ScrollView
        contentContainerStyle={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={{color: COLOURS.black, fontSize: 40, fontWeight: 'bold'}}>
          Register
        </Text>
        <Text style={{color: COLOURS.grey, fontSize: 18, marginVertical: 10}}>
          Enter Your Details to Register
        </Text>
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
            value={inputs.email}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'firstname')}
            onFocus={() => handleError(null, 'firstname')}
            iconName="account-outline"
            label="First Name"
            placeholder="Enter your first name"
            error={errors.firstname}
            value={inputs.firstname}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'lastname')}
            onFocus={() => handleError(null, 'lastname')}
            iconName="account-outline"
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.lastname}
            value={inputs.lastname}
          />

          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'phone')}
            onFocus={() => handleError(null, 'phone')}
            iconName="phone-outline"
            label="Phone Number"
            placeholder="Enter your phone no"
            error={errors.phone}
            value={inputs.phone}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            value={inputs.password}
            password
          />
          <RadioButtons childToParent={childToParent} />

          <Button title="Register" onPress={validate} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontSize: 16}}>
              {' '}
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={styles.link}>
                Login here
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
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

export default Signup;
