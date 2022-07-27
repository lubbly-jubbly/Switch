import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import Input from '../components/Input';
import COLOURS from '../conts/colours';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import TimePicker from '../components/TimePicker';
import format from 'date-fns/format';
import {ADD, CANCEL, CLOCK, INFO, SMALLNEXT, STAFF} from '../conts/icons';
import {getTotalHours, submitRegularShift} from '../apiService';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import {database} from '../apiService';
import auth from '@react-native-firebase/auth';
import getDay from 'date-fns/getDay';
import intervalToDuration from 'date-fns/intervalToDuration';
import {SmallButton} from '../components/SmallButton';
import {SmallCancelButton} from '../components/SmallCancelButton';
import {enGB} from 'date-fns/locale';

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
  const dayOfWeekNumber = getDay(parseISO(day));

  const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleAddShift = () => {
    setModalVisible(true);
  };

  function handleConfirmShift() {
    submitRegularShift(day, {
      starts: formatISO(inputs.starts),
      ends: formatISO(inputs.ends),
      employeesNeeded: inputs.employeesNeeded,
    });
    setModalVisible(false);
  }
  const handleDeleteShift = item => {
    database
      .ref('teams/' + teamId + '/regularShifts/' + day + '/' + item.Id)
      .remove()
      .then(setDeleteShiftModalVisible(!deleteShiftModalVisible));
  };

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);
    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      setTeamId(teamid);

      if (daysOfTheWeek.includes(day)) {
        var shiftsRef = database.ref(
          'teams/' + teamid + '/regularShifts/' + day + '/',
        );
      } else {
        var shiftsRef = database.ref(
          'teams/' +
            teamid +
            '/regularShifts/' +
            daysOfTheWeek[dayOfWeekNumber] +
            '/',
        );
      }
      shiftsRef.on('value', snapshot => {
        setShifts([]);

        snapshot.forEach(function (childSnapshot) {
          setShifts(shifts => [...shifts, childSnapshot.val()]);
        });
      });
    });

    const teamid = userInfo.team;
    const shiftsRef = database.ref('teams/' + teamid + '/shifts/' + day);

    const OnLoadingListener = shiftsRef.on('value', snapshot => {
      setShifts([]);

      snapshot.forEach(function (childSnapshot) {
        setShifts(shifts => [...shifts, childSnapshot.val()]);
      });
    });

    return () => {
      setUserInfo({}); // This worked for me
      userRef.off('value', OnLoadingListener);
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
              <Text
                style={[
                  FONTS.modalSubHeadingText,
                  {textAlign: 'center', marginTop: 8},
                ]}>
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
          <View style={styles.shiftContainer}>
            <View style={styles.timingsContainer}>
              <CLOCK />
              <View style={styles.startAndEndContainer}>
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
  const tabBarHeight = useBottomTabBarHeight();
  console.log(tabBarHeight);
  React.useEffect(() => {
    const user = auth().currentUser;
    const userid = user.uid;
    const userRef = database.ref('/users/' + userid);

    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;
      // console.log(teamid);
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
      // console.log(teamid);
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

    // const totalHours = await getTotalHours();

    return () => {};
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: COLOURS.white,
        flex: 1,
        padding: SIZES.padding,
      }}>
      <View style={{paddingBottom: 60}}>
        <Text style={FONTS.h2}>Default Shifts</Text>
        <Text style={[FONTS.h4, {marginBottom: 15, marginTop: 5}]}>
          Here, choose the default shifts in your workplace. For a particular
          day, the staff needed can be altered in the calendar.
        </Text>
        {daysOfTheWeek.map((day, index) => (
          <EditDayShifts day={day} />
        ))}

        <View style={styles.hoursInfoContainer}>
          {totalEmployeeHours < totalShiftHours ? (
            <View style={styles.hoursWarningContainer}>
              <INFO />
              <Text style={[styles.hoursWarningText, {textAlign: 'center'}]}>
                More shift hours than employee hours
              </Text>
            </View>
          ) : totalEmployeeHours > totalShiftHours ? (
            <View style={styles.hoursWarningContainer}>
              <Text style={[styles.hoursWarningText, {textAlign: 'center'}]}>
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
              <Text style={[styles.hoursAdviceText, {textAlign: 'center'}]}>
                Consider reducing shifts or increasing employee hours.
              </Text>
            </View>
          ) : totalEmployeeHours > totalShiftHours ? (
            <View style={styles.hoursAdviceContainer}>
              <Text style={[styles.hoursAdviceText, {textAlign: 'center'}]}>
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
  dayNameContainer: {
    // alignItems: 'center',
    // width: 120,
    borderRadius: SIZES.radius + 2,
    backgroundColor: COLOURS.paleGreen,
    borderColor: COLOURS.paleGreen,
    borderWidth: 1,
    marginVertical: 5,
    padding: 4,
    marginRight: 3,
  },
  dayContainer: {
    borderRadius: SIZES.radius,
    backgroundColor: COLOURS.white,
    // borderColor: COLOURS.paleGreen,
    // borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 8,
  },
  shiftContainer: {
    height: 35,
    marginVertical: 5,
    backgroundColor: COLOURS.light,
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
    // borderWidth: 0.5,
    justifyContent: 'space-between',
  },

  startAndEndContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    // borderWidth: 0.5,
    justifyContent: 'space-evenly',
  },
  employeesContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flex: 0.4,
    flexDirection: 'row',
    // borderWidth: 0.5,
    justifyContent: 'center',
  },

  //modal
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
    // borderColor: COLOURS.paleGreen,
    // borderWidth: 3,

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
