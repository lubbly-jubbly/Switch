import React from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';

export const handleSignOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};
