import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  return (
    <View>
      <Input
        iconName="lock-outline"
        label="Password"
        placeholder="Enter your password"
        password
      />
      <Button title="Submit" />
    </View>
  );
};

export default Login;
