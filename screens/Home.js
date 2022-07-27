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
// import {eachDayOfInterval, getDay, isBefore, parseISO} from 'date-fns';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import getDay from 'date-fns/getDay';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
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
        let shiftArray = [];

        shiftKeys.forEach(key => {
          const shiftRef = database.ref('teams/' + teamid + '/rota/' + key);
          shiftRef.once('value', snapshot => {
            // need to create new array in order to sort shifts by date
            shiftArray.push(snapshot.val());
            // console.log(shiftArray);
            shiftArray.sort((shift1, shift2) => {
              return isBefore(parseISO(shift1.starts), parseISO(shift2.starts))
                ? -1
                : 1;
            });
            // console.log('sorted' + shiftArray);
            setShifts([]);
            shiftArray.forEach(shift => {
              setShifts(shifts => [...shifts, shift]);
            });
          });
          // .then
          // console.log(shiftArray),
          // // setShifts([]);
          // // shiftRef
          // //   .once('value', snapshot => {
          // //     setShifts(shifts => [...shifts, snapshot.val()]);
          // //   })
          // //   .then(
          // shiftArray.sort((shift1, shift2) => {
          //   return isBefore(
          //     parseISO(shift1.starts),
          //     parseISO(shift2.starts),
          //   )
          //     ? -1
          //     : 1;
          // }),
          // console.log(shiftArray),
          // setShifts(shiftArray),
          // ();
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
