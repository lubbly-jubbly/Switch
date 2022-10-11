import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import {database, submitRegularShift} from '../apiService';
import {SmallButton} from '../components/SmallButton';
import {SmallCancelButton} from '../components/SmallCancelButton';
import TimePicker from '../components/TimePicker';
import COLOURS from '../conts/colours';
import {ADD, CANCEL, CLOCK, INFO, SMALLNEXT, STAFF} from '../conts/icons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';

/* Component added to ChooseShifts screen for each day of the week. */
export const EditDayShifts = ({day}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteShiftModalVisible, setDeleteShiftModalVisible] = useState(false);
  const [item, setItem] = useState({});
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState({});
  const [teamId, setTeamId] = React.useState('');
  const [shifts, setShifts] = useState([]);
  const [inputs, setInputs] = useState({
    starts: new Date(),
    ends: new Date(),
    employeesNeeded: '',
  });

  /* Called when user edits a field. Adds input to inputs state variable. */
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  /* Called when a user presses the add button to add a shift. 
  Makes add shift modal visible. */
  const handleAddShift = () => {
    setModalVisible(true);
  };

  /* Called when a user confirms the addition of a shift. 
  Adds shift to regularShifts node in database. */
  function handleConfirmShift() {
    submitRegularShift(day, {
      starts: formatISO(inputs.starts),
      ends: formatISO(inputs.ends),
      employeesNeeded: inputs.employeesNeeded,
    });
    setModalVisible(false);
  }

  /* Called when a user confirms the deletion of a shift. 
  Removes shift from regularShifts node in database. */
  const handleDeleteShift = item => {
    database
      .ref('teams/' + teamId + '/regularShifts/' + day + '/' + item.Id)
      .remove()
      .then(setDeleteShiftModalVisible(!deleteShiftModalVisible));
  };

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);
    // Fetches shifts
    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      setTeamId(teamid);
      const shiftsRef = database.ref(
        'teams/' + teamid + '/regularShifts/' + day + '/',
      );
      shiftsRef.on('value', snapshot => {
        setShifts([]);
        snapshot.forEach(function (childSnapshot) {
          setShifts(shifts => [...shifts, childSnapshot.val()]);
        });
      });
    });

    const teamid = userInfo.team;
    const shiftsRef = database.ref('teams/' + teamid + '/shifts/' + day);
    // Listens for changes to requests node and updates view.
    const ShiftListener = shiftsRef.on('value', snapshot => {
      setShifts([]);
      snapshot.forEach(function (childSnapshot) {
        setShifts(shifts => [...shifts, childSnapshot.val()]);
      });
    });

    return () => {
      setUserInfo({});
      shiftsRef.off('value', ShiftListener);
    };
  }, []);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}
                style={{alignSelf: 'flex-end'}}>
                <CANCEL />
              </Pressable>
              <Text
                style={[
                  FONTS.modalText,
                  {
                    textAlign: 'center',
                    marginBottom: 15,
                  },
                ]}>
                New shift on {day}
              </Text>
              <TimePicker
                label="Start time"
                onChange={(event, value) => handleOnchange(value, 'starts')}
                value={inputs.starts}
              />
              <TimePicker
                label="End time"
                onChange={(event, value) => handleOnchange(value, 'ends')}
                value={inputs.ends}
              />
              <View style={APPSTYLES.inputContainer}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Number of employees required"
                  placeholderTextColor={COLOURS.grey}
                  style={{flex: 1}}
                  // onChange={text => handleOnchange(text, 'employeesNeeded')}
                  onChangeText={text => handleOnchange(text, 'employeesNeeded')}
                  value={inputs.employeesNeeded}
                />
              </View>
            </View>

            <SmallButton
              onPress={() => handleConfirmShift()}
              title="Add shift"
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteShiftModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setDeleteShiftModalVisible(!deleteShiftModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, APPSTYLES.modal]}>
            <Text style={[FONTS.modalText]}>Delete shift?</Text>
            {'starts' in item ? (
              <Text style={[FONTS.modalSubHeadingText, styles.deleteModalText]}>
                Delete shift on {day} at {format(parseISO(item.starts), 'p')} -{' '}
                {format(parseISO(item.ends), 'p')}?
              </Text>
            ) : null}
            <View style={{flexDirection: 'row'}}>
              <SmallCancelButton
                title="Cancel"
                onPress={() =>
                  setDeleteShiftModalVisible(!deleteShiftModalVisible)
                }
              />
              <SmallButton
                title="Delete"
                onPress={() => handleDeleteShift(item)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.dayContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View style={styles.dayNameContainer}>
            <Text style={[FONTS.h3, {color: COLOURS.white}]}>{day}</Text>
          </View>
          <Pressable onPress={item => handleAddShift(item)}>
            <ADD />
          </Pressable>
        </View>
        {shifts.map((item, index) => (
          <View>
            {index !== 0 ? (
              <View
                style={{
                  borderBottomColor: COLOURS.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            ) : null}
            <View style={styles.shiftContainer}>
              <View style={styles.timingsContainer}>
                <CLOCK />
                <View style={[styles.startAndEndContainer]}>
                  <Text>{format(parseISO(item.starts), 'p')}</Text>
                  <SMALLNEXT />
                  <Text>{format(parseISO(item.ends), 'p')}</Text>
                </View>
              </View>
              <View style={styles.employeesContainer}>
                <STAFF />
                <Text>{item.employeesNeeded}</Text>
              </View>
              <Pressable
                onPress={() => {
                  setDeleteShiftModalVisible(true), setItem(item);
                }}>
                <CANCEL />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const ChooseShifts = () => {
  const daysOfTheWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [totalEmployeeHours, setTotalEmployeeHours] = useState(0);
  const [totalShiftHours, setTotalShiftHours] = useState(0);

  const [userInfo, setUserInfo] = React.useState({});

  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      let totalHrs = 0;
      database
        .ref('/users/')
        .orderByChild('team')
        .equalTo(teamid)
        .on('value', snapshot => {
          snapshot.forEach(function (childSnapshot) {
            totalHrs += parseInt(childSnapshot.val().hours);
          });
          setTotalEmployeeHours(totalHrs);
        });
    });

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      let totalShiftHrs = 0;
      daysOfTheWeek.forEach(day => {
        database
          .ref('/teams/' + teamid + '/regularShifts/' + day)
          .on('value', snapshot => {
            snapshot.forEach(function (childSnapshot) {
              const shiftHours =
                (Math.abs(
                  parseISO(childSnapshot.val().ends) -
                    parseISO(childSnapshot.val().starts),
                ) /
                  36e5) *
                childSnapshot.val().employeesNeeded;
              totalShiftHrs += shiftHours;
            });
            setTotalShiftHours(totalShiftHrs);
          });
      });
    });
    return () => {};
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bottomPadding}>
        <Text style={FONTS.h2}>Default Shifts</Text>
        <Text style={[FONTS.h4, styles.introText]}>
          Here, choose the default shifts in your workplace. These will be used
          to generate your rota.
        </Text>
        {daysOfTheWeek.map((day, index) => (
          <EditDayShifts day={day} />
        ))}

        <View style={styles.hoursInfoContainer}>
          {totalEmployeeHours < totalShiftHours ? (
            <View style={styles.hoursWarningContainer}>
              <INFO />
              <Text style={[styles.hoursWarningText, styles.centeredText]}>
                More shift hours than employee hours
              </Text>
            </View>
          ) : totalEmployeeHours > totalShiftHours ? (
            <View style={styles.hoursWarningContainer}>
              <Text style={[styles.hoursWarningText, styles.centeredText]}>
                <INFO />
                More employee hours than shift hours
              </Text>
            </View>
          ) : null}
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursText}>
              Total weekly employee hours: {totalEmployeeHours}
            </Text>
            <Text style={styles.hoursText}>
              Total weekly shift hours: {totalShiftHours}
            </Text>
          </View>
          {totalEmployeeHours < totalShiftHours ? (
            <View style={styles.hoursAdviceContainer}>
              <Text style={[styles.hoursAdviceText, styles.centeredText]}>
                Consider reducing shifts or increasing employee hours.
              </Text>
            </View>
          ) : totalEmployeeHours > totalShiftHours ? (
            <View style={styles.hoursAdviceContainer}>
              <Text style={[styles.hoursAdviceText, styles.centeredText]}>
                Consider adding more shifts or reducing employee hours.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredText: {textAlign: 'center'},
  container: {
    backgroundColor: COLOURS.white,
    flex: 1,
    padding: SIZES.padding,
  },
  introText: {marginBottom: 15, marginTop: 5},
  bottomPadding: {paddingBottom: 60},
  dayNameContainer: {
    borderRadius: SIZES.radius + 2,
    backgroundColor: COLOURS.blue,
    borderColor: COLOURS.paleGreen,
    borderWidth: 1,
    marginVertical: 5,
    padding: 4,
    marginRight: 3,
  },
  dayContainer: {
    borderRadius: SIZES.radius,
    backgroundColor: COLOURS.white,
    marginVertical: 5,
    paddingVertical: 8,
  },
  shiftContainer: {
    height: 35,
    marginVertical: 5,
    backgroundColor: COLOURS.white,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: SIZES.radius,
  },
  hoursInfoContainer: {
    marginVertical: 5,
    marginHorizontal: 0,
    backgroundColor: COLOURS.blue,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  hoursContainer: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },

  hoursText: {
    color: COLOURS.white,
    fontWeight: '500',
    marginVertical: 4,
  },
  hoursAdviceText: {
    color: COLOURS.white,
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 4,
  },
  hoursWarningText: {
    color: COLOURS.white,
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 4,
  },
  hoursAdviceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  hoursWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingsContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  startAndEndContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  employeesContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  //modal styles
  deleteModalText: {textAlign: 'center', marginTop: 8},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  button: {
    marginVertical: 15,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ChooseShifts;
