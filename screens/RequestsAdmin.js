import auth from '@react-native-firebase/auth';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {database} from '../apiService';
import TimeOffRequest from '../components/TimeOffRequest';
import COLOURS from '../conts/colours';
import {FONTS, SIZES} from '../conts/theme';

/* Requests tab for admin. */
const RequestsAdmin = () => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [requests, setRequests] = React.useState([]);


  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;

      // Fetches team's pending requests
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
    // Listens for changes to requests node and updates view.
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
      setUserInfo({});
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

export default RequestsAdmin;
