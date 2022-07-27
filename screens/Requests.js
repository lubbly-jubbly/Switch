import React, {useEffect} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {createRota} from '../createRota';
import MyRequest from '../components/MyRequest';
import COLOURS from '../conts/colours';
import {FONTS, SIZES} from '../conts/theme';
import auth from '@react-native-firebase/auth';
import {database} from '../apiService';

const Requests = () => {
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
        .orderByChild('sender')
        .equalTo(user.uid)
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
      .orderByChild('sender')
      .equalTo(user.uid)
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
          <Text style={FONTS.h3}>Pending time-off requests</Text>
        </View>
        {requests.map((item, index) => (
          <View>
            {item.status == 'pending' ? <MyRequest inputs={item} /> : null}
          </View>
        ))}
        <View>
          <Text style={FONTS.h3}>Accepted time-off requests</Text>
        </View>
        {requests.map((item, index) => (
          <View>
            {item.status == 'accepted' ? <MyRequest inputs={item} /> : null}
          </View>
        ))}
        <View>
          <Text style={FONTS.h3}>Rejected time-off requests</Text>
        </View>
        {requests.map((item, index) => (
          <View>
            {item.status == 'rejected' ? <MyRequest inputs={item} /> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Requests;
