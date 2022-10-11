import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {database} from '../apiService';
import COLOURS from '../conts/colours';
import {EDIT, EMAIL, PHONE} from '../conts/icons';
import {APPSTYLES, SIZES} from '../conts/theme';
import {handleSignOut} from '../authService';

/* Profile tab first screen for admin. */
const ProfileAdmin = ({navigation}) => {
  const [userInfo, setUserInfo] = useState({});

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    // fetch user's info
    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team).once('value', snapshot => {
        setUserInfo(info => ({...info, teamName: snapshot.val().name}));
      });
    });

    // listens for changes to user's node and updates view.
    const OnLoadingListener = userRef.on('value', snapshot => {
      setUserInfo(snapshot.val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team).once('value', snapshot => {
        setUserInfo(info => ({...info, teamName: snapshot.val().name}));
      });
    });

    return () => {
      userRef.off('value', OnLoadingListener);
    };
  }, []);
  return (
    <SafeAreaView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View
        style={[
          APPSTYLES.itemContainer,
          {marginHorizontal: SIZES.padding, marginTop: SIZES.padding},
        ]}>
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
      <View
        style={{
          borderBottomColor: COLOURS.grey,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Edit Team')}>
        <Text style={styles.textStyle}>Edit Team</Text>
      </Pressable>
      <View
        style={{
          borderBottomColor: COLOURS.grey,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Choose Shifts')}>
        <Text style={styles.textStyle}>Edit shift structure</Text>
      </Pressable>

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
    </SafeAreaView>
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
    marginHorizontal: 22,
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
  button: {
    marginTop: 0,
    padding: 15,
    elevation: 2,
    marginHorizontal: 7,
    flexDirection: 'row',
  },
  buttonClose: {
    backgroundColor: COLOURS.blue,
  },
  textStyle: {
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: SIZES.body3,
  },

  infoItem: {
    marginVertical: 10,
  },
  contactInfoItem: {
    marginTop: 5,
  },
  listText: {
    fontWeight: 'bold',
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
});

export default ProfileAdmin;
