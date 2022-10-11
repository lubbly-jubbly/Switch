import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {database, editUserHours, removeUserFromTeam} from '../apiService';
import {SmallButton} from '../components/SmallButton';
import {SmallCancelButton} from '../components/SmallCancelButton';
import UserName from '../components/UserName';
import COLOURS from '../conts/colours';
import {BIN, CANCEL, EDIT, EMAIL, PHONE} from '../conts/icons';
import {APPSTYLES, FONTS, MODALSTYLES, SIZES} from '../conts/theme';

/* Edit team screen (admin only) */
const EditTeam = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [modalVisible, setModalVisible] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(null);
  const [hours, setHours] = useState('');

  /* Called when admin confirms removal of user. Removes user from team */
  const removeUser = id => {
    removeUserFromTeam(id);
  };

  /* Called when user confirms hours change for employee. */
  const editHours = id => {
    editUserHours(id, hours);
    setModalVisible(null);
  };

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    // Fetches team join code
    userRef.once('value').then(snapshot => {
      setTeam(snapshot.child('team').val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team + '/joinCode').on('value', snapshot => {
        setJoinCode(snapshot.val());
      }),
        // Fetches info of all team members
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
    // Listens for changes to team members' nodes and updates view.
    const OnLoadingListener = usersRef
      .orderByChild('team')
      .equalTo(team)
      .on('value', snapshot => {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().isAdmin) {
            setUsers(users => [childSnapshot.val(), ...users]);
          } else {
            setUsers(users => [...users, childSnapshot.val()]);
          }
        });
      });

    return () => {
      usersRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View style={{paddingBottom: 60}}>
        <View style={{paddingBottom: 15}}>
          <Text style={FONTS.h2}>My Team</Text>

          <Text>Team Join Code: {joinCode}</Text>
        </View>

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
                      {item.isAdmin
                        ? 'Edit your weekly hours'
                        : 'Edit ' + item.firstname + "'s weekly hours"}
                    </Text>
                    <Text>Current Hours: {item.hours}</Text>
                    <View style={APPSTYLES.inputContainer}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="New hours"
                        placeholderTextColor={COLOURS.grey}
                        style={{flex: 1}}
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
                    <SmallCancelButton
                      onPress={() => setDeleteModalVisible(null)}
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

            <View>
              <View
                style={{
                  borderBottomColor: COLOURS.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />

              <View style={APPSTYLES.itemContainerWhite}>
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
                          color: COLOURS.blue,
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
                        <Text style={styles.individualContact}>
                          {item.phone}
                        </Text>
                      </View>
                    ) : null}
                    {item.phone !== undefined ? (
                      <View
                        style={[
                          styles.individualContactContainer,
                          styles.infoItem,
                        ]}>
                        <EMAIL />
                        <Text style={styles.individualContact}>
                          {item.email}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={styles.btnContainer}></View>
              </View>
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
  modalView: {
    margin: 20,
    backgroundColor: COLOURS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',

    shadowColor: COLOURS.paleGreen,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 50,
  },
});

export default EditTeam;
