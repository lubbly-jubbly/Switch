import auth from '@react-native-firebase/auth';
import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {addUserDetails} from '../apiService';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import COLOURS from '../conts/colours';
import {FONTS} from '../conts/theme';

/* Sign up screen. */
const Signup = ({navigation}) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    password: '',
    hours: '',
    age: '',
  });
  const [errors, setErrors] = React.useState({});

  /* Called if validate is successful. Adds user to authentication database and main database. */
  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(inputs.email, inputs.password)
      .then(() => {
        const user = auth().currentUser;
        addUserDetails(
          inputs.firstname,
          inputs.lastname,
          user.uid,
          inputs.phone,
          inputs.email,
        );
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
      });
  };

  /* Called when the user presses submit button. Checks that all fields are
   filled out and that the user is not under 18. */
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
    if (!inputs.password) {
      handleError('Please enter your age.', 'age');
      isValid = false;
    }
    if (parseInt(inputs.age) < 18) {
      alert('You must be 18 or over to use this app.');
      isValid = false;
    }

    if (isValid) {
      handleSignUp();
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text style={FONTS.h1}>Register</Text>
        <Text style={FONTS.h2}>Enter Your Details to Register</Text>
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-outline"
            iconFocused="mail"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
            value={inputs.email}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'firstname')}
            onFocus={() => handleError(null, 'firstname')}
            iconName="person-outline"
            iconFocused="person"
            label="First Name"
            placeholder="Enter your first name"
            error={errors.firstname}
            value={inputs.firstname}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'lastname')}
            onFocus={() => handleError(null, 'lastname')}
            iconName="person-outline"
            iconFocused="person"
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.lastname}
            value={inputs.lastname}
          />

          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'phone')}
            onFocus={() => handleError(null, 'phone')}
            iconName="call-outline"
            iconFocused="call"
            label="Phone Number"
            placeholder="Enter your phone no"
            error={errors.phone}
            value={inputs.phone}
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
          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'age')}
            onFocus={() => handleError(null, 'age')}
            iconName="cake"
            iconFocused="cake"
            label="Age"
            placeholder="Enter your age"
            error={errors.age}
            value={inputs.age}
            entypo
          />

          <BigButton title="Register" onPress={validate} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontSize: 16}}>
              {' '}
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={FONTS.smallBlue}>
                Log in
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
  contentContainerStyle: {paddingTop: 70, paddingHorizontal: 20},
  container: {backgroundColor: COLOURS.white, flex: 1},
});

export default Signup;
