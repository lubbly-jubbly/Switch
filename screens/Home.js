import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOURS from '../conts/colours';
import Shift from '../components/Shift';
import auth from '@react-native-firebase/auth';
import {getUserFirstName} from '../apiService';
import {database} from '../apiService';
import TimeOffRequest from '../components/TimeOffRequest';
import {FONTS, SIZES} from '../conts/theme';
import {getUserInfo} from '../apiService';
const HomeAdmin = ({navigation}) => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [requests, setRequests] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);

  // userInfoRetrieved = info => {
  //   setUserInfo(info);
  // };

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;

      // get shifts
      const shiftsRef = database.ref('users/' + user.uid + '/shifts/');
      let shiftKeys = [];
      shiftsRef.on('value', snapshot => {
        snapshot.forEach(function (childSnapshot) {
          shiftKeys.push(childSnapshot.val());
        });
        shiftKeys.forEach(key => {
          const shiftRef = database.ref('teams/' + teamid + '/rota/' + key);
          setShifts([]);
          shiftRef.once('value', snapshot => {
            setShifts(shifts => [...shifts, snapshot.val()]);
          });
        });
      });
    });

    const teamid = userInfo.team;

    // const shiftsRef = database.ref('users/' + user.uid + '/shifts/');
    // const ShiftsListener = shiftsRef.on('value', snapshot => {
    //   let shiftKeys = [];
    //   snapshot.forEach(function (childSnapshot) {
    //     shiftKeys.push(childSnapshot.val());
    //   });
    //   shiftKeys.forEach(key => {
    //     const shiftRef = database.ref('teams/' + teamid + '/rota/' + key);
    //     setShifts([]);
    //     shiftRef.once('value', snapshot => {
    //       setShifts(shifts => [...shifts, snapshot.val()]);
    //     });
    //   });
    // });

    return () => {
      setUserInfo({}); // This worked for me
      // userRef.off('value', ShiftsListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View style={{paddingBottom: 60}}>
        <Text style={FONTS.h1}>Welcome back, {userInfo.firstname}!</Text>
        <Text style={FONTS.h2}>Your shifts this week:</Text>
        <View style={styles.shiftContainer}>
          {/* {/* <Shift navigation={navigation} day={new Date()} /> */}
          {/* <Shift navigation={navigation} day={new Date()} /> */}
          {shifts.map((item, index) => (
            <View>
              <Shift navigation={navigation} shiftDetails={item} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {},
});

export default HomeAdmin;
