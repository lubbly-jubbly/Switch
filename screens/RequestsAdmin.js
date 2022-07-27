import React, {useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOURS from '../conts/colours';
import Shift from '../components/Shift';
import auth from '@react-native-firebase/auth';
import {database} from '../apiService';
import TimeOffRequest from '../components/TimeOffRequest';
import {FONTS, SIZES} from '../conts/theme';
import {getUserInfo} from '../apiService';
const RequestsAdmin = () => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;

      //get requests
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

    const teamid = userInfo.team;
    const requestsRef = database.ref('teams/' + teamid + '/requests/');
    const RequestsListener = requestsRef
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
      userRef.off('value', RequestsListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View style={{paddingBottom: 60}}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {},
});

export default RequestsAdmin;
