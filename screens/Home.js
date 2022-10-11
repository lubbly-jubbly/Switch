import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {database} from '../apiService';
import Shift from '../components/Shift';
import COLOURS from '../conts/colours';
import {FONTS, SIZES} from '../conts/theme';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';

/* Home tab first screen. */
const Home = ({navigation}) => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [shifts, setShifts] = React.useState([]);

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      const shiftRef = database.ref('teams/' + teamid + '/rota/');
      // Fetches team's shifts
      shiftRef.once('value', snapshot => {
        setShifts([]);
        let shiftArray = [];
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().assignedEmployees.includes(user.uid)) {
            shiftArray.push(childSnapshot.val());
          }
        });
        // Sorts shift array chronologically.
        shiftArray.sort((shift1, shift2) => {
          return isBefore(parseISO(shift1.starts), parseISO(shift2.starts))
            ? -1
            : 1;
        });
        shiftArray.forEach(shift => {
          setShifts(shifts => [...shifts, shift]);
        });
      });
    });

    const teamid = userInfo.team;
    const shiftRef = database.ref('teams/' + teamid + '/rota/');

    // listens for changes to rota node and updates view.
    const ShiftListener = shiftRef.on('value', snapshot => {
      setShifts([]);

      let shiftArray = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.hasChild('assignedEmployees')) {
          if (childSnapshot.val()['assignedEmployees'].includes(user.uid)) {
            shiftArray.push(childSnapshot.val());
          }
        }
      });

      shiftArray.sort((shift1, shift2) => {
        return isBefore(parseISO(shift1.starts), parseISO(shift2.starts))
          ? -1
          : 1;
      });

      shiftArray.forEach(shift => {
        setShifts(shifts => [...shifts, shift]);
      });
    });

    return () => {
      setUserInfo({});
      setShifts([]);
      shiftRef.off('value', ShiftListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View style={{paddingBottom: 60}}>
        <Text style={FONTS.h1}>Welcome, {userInfo.firstname}!</Text>

        {shifts.length !== 0 ? (
          <View>
            <Text style={FONTS.h2}>Your upcoming shifts:</Text>
            <View style={styles.shiftContainer}>
              {shifts.map((item, index) => (
                <View>
                  <Shift navigation={navigation} shiftDetails={item} />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={FONTS.h2}>You don't have any upcoming shifts.</Text>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  shiftContainer: {},
});

export default Home;
