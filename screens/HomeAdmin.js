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

  userInfoRetrieved = info => {
    setUserInfo(info);
  };

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      const requestsRef = database.ref('teams/' + teamid + '/requests/');
      requestsRef
        .orderByChild('status')
        .equalTo('pending')
        .on('value', snapshot => {
          setRequests([]);

          snapshot.forEach(function (childSnapshot) {
            setRequests(requests => [...requests, childSnapshot.val()]);
          });
        });
    });

    // getUserInfo(userInfoRetrieved);

    const teamid = userInfo.team;
    const requestsRef = database.ref('teams/' + teamid + '/requests/');

    const OnLoadingListener = requestsRef
      .orderByChild('status')
      .equalTo('pending')
      .on('value', snapshot => {
        setRequests([]);

        snapshot.forEach(function (childSnapshot) {
          setRequests(requests => [...requests, childSnapshot.val()]);
        });
      });

    return () => {
      setUserInfo({}); // This worked for me
      userRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <Text style={FONTS.h1}>Welcome back, {userInfo.firstname}!</Text>
      <Text style={FONTS.h2}>Your shifts this week:</Text>
      <View style={styles.shiftContainer}>
        <Shift navigation={navigation} day={new Date()} />
        <Shift navigation={navigation} day={new Date()} />
      </View>
      <View>
        <Text style={FONTS.h2}>
          {requests.length} pending time-off requests
        </Text>
      </View>
      {requests.map((item, index) => (
        <View>
          <TimeOffRequest inputs={item} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {},
});

export default HomeAdmin;
