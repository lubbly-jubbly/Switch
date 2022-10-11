import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {} from 'react-native-paper';
import {database} from '../apiService';
import COLOURS from '../conts/colours';
import {EDIT, EMAIL, PHONE} from '../conts/icons';
import {APPSTYLES, SIZES} from '../conts/theme';
import {handleSignOut} from '../authService';

/* Profile tab first screen for employee. */
const Profile = ({navigation}) => {
  const [userInfo, setUserInfo] = useState({});
  const [admin, setAdmin] = useState({});

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    // fetches user's info
    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team).once('value', snapshot => {
        setUserInfo(info => ({...info, teamName: snapshot.val().name}));
      });

      // fetches user's admin's info
      database
        .ref('/users/')
        .orderByChild('team')
        .equalTo(team)
        .once('value', snapshot => {
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val().isAdmin) {
              setAdmin(childSnapshot.val());
            }
          });
        });
    });

    // listens for changes to user's node and updates view.
    const OnLoadingListener = userRef.on('value', snapshot => {
      setUserInfo(snapshot.val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team).once('value', snapshot => {
        setUserInfo(info => ({...info, teamName: snapshot.val().name}));
      });

      database
        .ref('/users/')
        .orderByChild('team')
        .equalTo(team)
        .on('value', snapshot => {
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val().isAdmin) {
              setAdmin(childSnapshot.val());
            }
          });
        });
    });
    return () => {
      userRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <View
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View>
        <View style={[APPSTYLES.itemContainer, {marginVertical: 20}]}>
          <View style={[styles.rowFlex, styles.infoItem]}>
            <Text>
              <Text style={styles.listText}>Name: </Text>
              {userInfo.firstname} {userInfo.lastname}
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate('Edit Details', {
                  firstname: userInfo.firstname,
                  lastname: userInfo.lastname,
                  hours: userInfo.hours,
                  phone: userInfo.phone,
                  email: userInfo.email,
                  id: userInfo.Id,
                })
              }>
              <EDIT />
            </Pressable>
          </View>
          <View style={styles.weeklyHoursContainer}>
            <Text style={[styles.weeklyHours, styles.infoItem]}>
              <Text style={styles.listText}>Weekly hours: </Text>
              {userInfo.hours}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.listText}>Contact Details:</Text>
            {userInfo.phone !== undefined ? (
              <View
                style={[
                  styles.individualContactContainer,
                  styles.contactInfoItem,
                ]}>
                <PHONE />
                <Text style={styles.individualContact}>{userInfo.phone}</Text>
              </View>
            ) : null}

            {userInfo.phone !== undefined ? (
              <View
                style={[
                  styles.individualContactContainer,
                  styles.contactInfoItem,
                ]}>
                <EMAIL />
                <Text style={styles.individualContact}>{userInfo.email}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View style={APPSTYLES.itemContainer}>
        <Text style={[styles.infoItem]}>
          <Text style={styles.listText}>Team:</Text> {userInfo.teamName}
        </Text>

        <Text style={[styles.infoItem]}>
          <Text style={styles.listText}>Manager:</Text> {admin.firstname}{' '}
          {admin.lastname}
        </Text>
        <View style={styles.infoItem}>
          <Text style={styles.listText}>Contact Details:</Text>
          {admin.phone !== undefined ? (
            <View
              style={[
                styles.individualContactContainer,
                styles.contactInfoItem,
              ]}>
              <PHONE />
              <Text style={styles.individualContact}>{admin.phone}</Text>
            </View>
          ) : null}
          {admin.phone !== undefined ? (
            <View
              style={[
                styles.individualContactContainer,
                styles.contactInfoItem,
              ]}>
              <EMAIL />
              <Text style={styles.individualContact}>{admin.email}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={{
          borderBottomColor: COLOURS.grey,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Pressable style={styles.button} onPress={handleSignOut}>
        <Text style={styles.textStyle}>Sign Out</Text>
      </Pressable>
      <View
        style={{
          borderBottomColor: COLOURS.grey,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLOURS.light,
    flexDirection: 'column',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'column',
  },

  infoContainer: {},
  btnContainer: {},

  individualContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  individualContact: {
    marginLeft: 7,
  },
  infoListContainer: {
    marginTop: 5,
  },
  infoItem: {
    marginVertical: 10,
  },
  contactInfoItem: {
    marginTop: 5,
  },
  weeklyHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyHours: {},
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 0,
    padding: 15,
    elevation: 2,
    marginHorizontal: 7,
    flexDirection: 'row',
  },
  listText: {
    fontWeight: 'bold',
  },
});
export default Profile;
