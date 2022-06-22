import React from 'react';
import {Text, View} from 'react-native';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';

const Profile = () => {
  const user = auth().currentUser;

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <View>
      <Text>welcome {user.displayName}</Text>
      <Button title="signout" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;
