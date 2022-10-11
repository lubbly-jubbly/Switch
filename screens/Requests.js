import auth from '@react-native-firebase/auth';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {database} from '../apiService';
import MyRequest from '../components/MyRequest';
import COLOURS from '../conts/colours';
import {FONTS, SIZES} from '../conts/theme';

/*  Requests tab for employee. */
const Requests = () => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;

      // Fetches requests sent by user
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
    // Listens for changes to requests node and updates view.
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
      setUserInfo({});
      userRef.off('value', RequestsListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      {requests.length !== 0 ? (
        <View style={{paddingBottom: 60}}>
          <Text style={FONTS.h2}>My Time-Off Requests</Text>
          <View>
            <Text style={FONTS.h3}>Pending</Text>
          </View>
          {requests.map((item, index) => (
            <View>
              {item.status == 'pending' ? <MyRequest inputs={item} /> : null}
            </View>
          ))}
          <View>
            <Text style={FONTS.h3}>Accepted</Text>
          </View>
          {requests.map((item, index) => (
            <View>
              {item.status == 'accepted' ? <MyRequest inputs={item} /> : null}
            </View>
          ))}
          <View>
            <Text style={FONTS.h3}>Rejected</Text>
          </View>
          {requests.map((item, index) => (
            <View>
              {item.status == 'rejected' ? <MyRequest inputs={item} /> : null}
            </View>
          ))}
        </View>
      ) : (
        <Text style={FONTS.h2}>No Time-Off Requests.</Text>
      )}
    </ScrollView>
  );
};

export default Requests;
