import React from 'react';
import {Text, View, Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import EditTeam from './EditTeam';
import COLOURS from '../conts/colours';
import {FONTS, SIZES} from '../conts/theme';

const ProfileAdmin = ({navigation}) => {
  const user = auth().currentUser;

  const database = firebase
    .app()
    .database(
      'https://calendarauth-b8522-default-rtdb.europe-west1.firebasedatabase.app/',
    );

  // const reference = database
  //   .ref('/teams/age')
  //   .once('value')
  //   .then(snapshot => {
  //     console.log('User data: ', snapshot.val());
  //   });

  // const reference2 = database
  //   .ref('/teams/')
  //   .set({
  //     name: 'Ada Lovelace',
  //     age: 31,
  //   })
  //   .then(() => console.log('Data set.'));

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <SafeAreaView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <Button
        title="Edit Team"
        onPress={() => navigation.navigate('Edit Team')}
      />
      <Button
        title="Edit shift structure"
        onPress={() => navigation.navigate('Choose Shifts')}
      />
      <Button title="Sign out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default ProfileAdmin;
