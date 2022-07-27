import React, {useState} from 'react';
import {
  Text,
  Alert,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {database, editUserHours, removeUserFromTeam} from '../apiService';
import {submitUser} from '../apiService';
import {FONTS, SIZES, APPSTYLES, MODALSTYLES} from '../conts/theme';
import COLOURS from '../conts/colours';
import {getUserInfo, getUserTeam} from '../userInfo';
import auth from '@react-native-firebase/auth';
import {UserName} from '../components/UserName';
import {BIN, CANCEL, EDIT, EMAIL, PHONE} from '../conts/icons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {SmallButton} from '../components/SmallButton';

const EditTeam = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [modalVisible, setModalVisible] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(null);

  const [hours, setHours] = useState('');

  const removeUser = id => {
    removeUserFromTeam(id);
  };

  const editHours = id => {
    editUserHours(id, hours);
    setModalVisible(null);
  };

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    userRef.once('value').then(snapshot => {
      setTeam(snapshot.child('team').val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team + '/joinCode').once('value', snapshot => {
        setJoinCode(snapshot.val());
      }),
        database
          .ref('/users/')
          .orderByChild('team')
          .equalTo(team)
          .on('value', snapshot => {
            setUsers([]);

            snapshot.forEach(function (childSnapshot) {
              if (childSnapshot.val().isAdmin) {
                setUsers(users => [childSnapshot.val(), ...users]);
              } else {
                setUsers(users => [...users, childSnapshot.val()]);
              }
            });
          });
    });

    const usersRef = database.ref('/users/');
    const OnLoadingListener = usersRef
      .orderByChild('team')
      .equalTo(team)
      .on('value', snapshot => {
        setUsers([]);

        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().isAdmin) {
            setUsers(users => [childSnapshot.val(), ...users]);
          } else {
            setUsers(users => [...users, childSnapshot.val()]);
          }
        });
      });

    return () => {
      userRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View style={{paddingBottom: 60}}>
        <Text style={FONTS.h2}>My Team</Text>

        <Text>Team Join Code: {joinCode}</Text>

        {users.map((item, index) => (
          <View>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible == index}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(null);
              }}>
              <View style={MODALSTYLES.centeredView}>
                <View style={MODALSTYLES.modalView}>
                  <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
                    <Pressable
                      onPress={() => {
                        setModalVisible(null);
                        setHours(null);
                      }}
                      style={{alignSelf: 'flex-end'}}>
                      <CANCEL />
                    </Pressable>
                    <Text
                      style={[
                        FONTS.modalText,
                        {textAlign: 'center', marginBottom: 15},
                      ]}>
                      Edit {item.firstname}'s weekly hours
                    </Text>
                    <Text>Current Hours: {item.hours}</Text>
                    <View style={APPSTYLES.inputContainer}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="New hours"
                        placeholderTextColor={COLOURS.grey}
                        style={{flex: 1}}
                        // onChange={text => handleOnchange(text, 'employeesNeeded')}
                        onChangeText={text => setHours(text)}
                        value={hours}
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

            <Modal
              animationType="none"
              transparent={true}
              visible={deleteModalVisible == index}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setDeleteModalVisible(null);
              }}>
              <View style={MODALSTYLES.centeredView}>
                <View style={MODALSTYLES.modalView}>
                  <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
                    <Pressable
                      onPress={() => {
                        setDeleteModalVisible(null);
                      }}
                      style={{alignSelf: 'flex-end'}}>
                      <CANCEL />
                    </Pressable>
                    <Text
                      style={[
                        FONTS.modalText,
                        {textAlign: 'center', marginBottom: 15},
                      ]}>
                      Are you sure you want to remove{' '}
                      {item.firstname + ' ' + item.lastname} from your team?
                      This action can't be undone.
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <SmallButton
                      onPress={() => console.log('hi')}
                      title="Cancel"
                    />
                    <SmallButton
                      onPress={() => removeUser(item.Id)}
                      title="Remove"
                    />
                  </View>
                </View>
              </View>
            </Modal>

            <View style={APPSTYLES.itemContainer}>
              <View style={styles.infoContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <UserName
                    name={item.firstname + ' ' + item.lastname}
                    colour={item.colour}
                  />

                  {item.isAdmin ? (
                    <Text
                      style={{
                        color: COLOURS.purple,
                        fontWeight: '600',
                        fontSize: SIZES.body3,
                      }}>
                      Admin
                    </Text>
                  ) : null}
                  {!item.isAdmin ? (
                    <Pressable onPress={() => setDeleteModalVisible(index)}>
                      <BIN />
                    </Pressable>
                  ) : null}
                </View>
                <View style={styles.infoListContainer}>
                  <View style={styles.weeklyHoursContainer}>
                    <Text style={[styles.weeklyHours, styles.infoItem]}>
                      Weekly hours: {item.hours}
                    </Text>
                    <Pressable onPress={() => setModalVisible(index)}>
                      <EDIT />
                    </Pressable>
                  </View>
                  {item.phone !== undefined ? (
                    <View
                      style={[
                        styles.individualContactContainer,
                        styles.infoItem,
                      ]}>
                      <PHONE />
                      <Text style={styles.individualContact}>{item.phone}</Text>
                    </View>
                  ) : null}
                  {item.phone !== undefined ? (
                    <View
                      style={[
                        styles.individualContactContainer,
                        styles.infoItem,
                      ]}>
                      <EMAIL />
                      <Text style={styles.individualContact}>{item.email}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.btnContainer}></View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default EditTeam;
