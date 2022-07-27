import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import EditTeam from './EditTeam';
import COLOURS from '../conts/colours';
import {APPSTYLES, FONTS, MODALSTYLES, SIZES} from '../conts/theme';
import {database} from '../apiService';
import {CANCEL, EDIT, EMAIL, PHONE} from '../conts/icons';
import {} from 'react-native-paper';
import {SmallButton} from '../components/SmallButton';
import Input from '../components/Input';
const Profile = ({navigation}) => {
  const [userInfo, setUserInfo] = useState({});
  const [admin, setAdmin] = useState({});
  const [inputs, setInputs] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const [modalVisible, setModalVisible] = useState(null);

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  console.log(inputs.hours);
  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      setInputs(snapshot.val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team).once('value', snapshot => {
        setUserInfo(info => ({...info, teamName: snapshot.val().name}));
      });

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

    const OnLoadingListener = userRef.on('value', snapshot => {
      setUserInfo(snapshot.val());
      setInputs(snapshot.val());
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
    //   setTeam(snapshot.child('team').val());
    //   const team = snapshot.child('team').val();
    //   database.ref('/teams/' + team + '/joinCode').once('value', snapshot => {
    //     setJoinCode(snapshot.val());
    //   }),
    //     database
    //       .ref('/users/')
    //       .orderByChild('team')
    //       .equalTo(team)
    //       .on('value', snapshot => {
    //         setUsers([]);

    //         snapshot.forEach(function (childSnapshot) {
    //           if (childSnapshot.val().isAdmin) {
    //             setUsers(users => [childSnapshot.val(), ...users]);
    //           } else {
    //             setUsers(users => [...users, childSnapshot.val()]);
    //           }
    //         });
    //       });
    // });

    // const usersRef = database.ref('/users/');
    // const OnLoadingListener = usersRef
    //   .orderByChild('team')
    //   .equalTo(team)
    //   .on('value', snapshot => {
    //     setUsers([]);

    //     snapshot.forEach(function (childSnapshot) {
    //       if (childSnapshot.val().isAdmin) {
    //         setUsers(users => [childSnapshot.val(), ...users]);
    //       } else {
    //         setUsers(users => [...users, childSnapshot.val()]);
    //       }
    //     });
    //   });

    return () => {
      userRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <View
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(false);
          }}>
          <View style={MODALSTYLES.centeredView}>
            <View style={MODALSTYLES.modalView}>
              <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <CANCEL />
                </Pressable>
                <Text
                  style={[
                    FONTS.modalText,
                    {textAlign: 'center', marginBottom: 15},
                  ]}>
                  Edit details
                </Text>
                <Text>Current Hours:</Text>
                <View style={styles.inputContainer}>
                  {/* <TextInput
                    keyboardType="numeric"
                    placeholder="New hours"
                    placeholderTextColor={COLOURS.grey}
                    style={{flex: 1}}
                    // onChange={text => handleOnchange(text, 'employeesNeeded')}
                    onChangeText={text => handleOnchange(text, 'hours')}
                    value={userInfo.hours}
                  /> */}

                  <Input
                    onChangeText={text => handleOnchange(text, 'firstname')}
                    onFocus={() => handleError(null, 'firstname')}
                    iconName="person-outline"
                    iconFocused="person"
                    label="First Name"
                    placeholder="Enter your first name"
                    error={errors.firstname}
                    value={inputs.firstname}
                  />

                  <Input
                    onChangeText={text => handleOnchange(text, 'lastname')}
                    onFocus={() => handleError(null, 'lastname')}
                    iconName="person-outline"
                    iconFocused="person"
                    label="Last Name"
                    placeholder="Enter your last name"
                    error={errors.lastname}
                    value={inputs.lastname}
                  />

                  {/* <Input
                    keyboardType="numeric"
                    onChangeText={text => handleOnchange(text, 'hours')}
                    onFocus={() => handleError(null, 'hours')}
                    iconName="time-outline"
                    iconFocused="time"
                    label="Weekly hours"
                    placeholder="Enter your weekly hours"
                    error={errors.hours}
                    value={inputs.hours.toString()}
                  /> */}
                  <Input
                    onChangeText={text => handleOnchange(text, 'email')}
                    onFocus={() => handleError(null, 'email')}
                    iconName="mail-outline"
                    iconFocused="mail"
                    label="Email"
                    value={inputs.email}
                    placeholder="Enter your email address"
                    error={errors.email}
                  />

                  <Input
                    keyboardType="numeric"
                    onChangeText={text => handleOnchange(text, 'phone')}
                    onFocus={() => handleError(null, 'phone')}
                    iconName="call-outline"
                    iconFocused="call"
                    label="Phone Number"
                    placeholder="Enter your phone no"
                    error={errors.phone}
                    value={inputs.phone}
                  />
                </View>
              </View>

              <SmallButton
                onPress={() => editHours(item.Id)}
                title="Change Hours"
              />
            </View>
          </View>
        </Modal>

        <View style={[APPSTYLES.itemContainer, {marginVertical: 20}]}>
          <View style={styles.rowFlex}>
            <Text>
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
          {/* <View style={styles.infoListContainer}> */}
          <View style={styles.weeklyHoursContainer}>
            <Text style={[styles.weeklyHours, styles.infoItem]}>
              Weekly hours: {userInfo.hours}
            </Text>
          </View>
          {userInfo.phone !== undefined ? (
            <View style={[styles.individualContactContainer, styles.infoItem]}>
              <PHONE />
              <Text style={styles.individualContact}>{userInfo.phone}</Text>
            </View>
          ) : null}

          {userInfo.phone !== undefined ? (
            <View style={[styles.individualContactContainer, styles.infoItem]}>
              <EMAIL />
              <Text style={styles.individualContact}>{userInfo.email}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={APPSTYLES.itemContainer}>
        <Text>My Team</Text>
        <Text style={[styles.infoItem]}>Team: {userInfo.teamName}</Text>

        <Text>
          Manager: {admin.firstname} {admin.lastname}
        </Text>
        <Text>Contact Details:</Text>
        {admin.phone !== undefined ? (
          <View style={[styles.individualContactContainer, styles.infoItem]}>
            <PHONE />
            <Text style={styles.individualContact}>{admin.phone}</Text>
          </View>
        ) : null}
        {admin.phone !== undefined ? (
          <View style={[styles.individualContactContainer, styles.infoItem]}>
            <EMAIL />
            <Text style={styles.individualContact}>{admin.email}</Text>
          </View>
        ) : null}
      </View>
      <Button
        title="View Requests"
        onPress={() => navigation.navigate('My Requests')}
      />

      <Button title="Sign out" onPress={handleSignOut} />
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
    marginVertical: 5,
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
export default Profile;
