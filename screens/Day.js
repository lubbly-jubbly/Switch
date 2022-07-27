import React, {useState} from 'react';
import {Alert, Pressable, SafeAreaView} from 'react-native';
import {StyleSheet, Button, Text, View, ScrollView} from 'react-native';
import Rota from '../components/Rota';
import COLOURS from '../conts/colours';
import TimeOffInfo from '../components/TimeOffInfo';
import auth from '@react-native-firebase/auth';
import {database} from '../apiService';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import {EditDayShifts} from './ChooseShifts';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import Shift from '../components/Shift';
import {NEXT, PREVIOUS} from '../conts/icons';
import ShiftItem from '../components/ShiftItem';

export const checkSameDay = (startOfDay, endOfDay, item) => {
  //set up day interval
  // const startOfDay = new Date(day);
  // const endOfDay = new Date(day);
  // endOfDay.setHours(24, 59);
  // console.log(endOfDay);

  const itemStartDate = parseISO(item.starts);
  const itemEndDate = parseISO(item.ends);

  const checkRepeats = interval => {
    for (let i = 0; i < 100; i++) {
      if (
        areIntervalsOverlapping(
          {start: itemStartDate, end: itemEndDate},
          {start: startOfDay, end: endOfDay},
        )
      ) {
        return true;
      }
      itemStartDate.setDate(itemStartDate.getDate() + interval);
      itemEndDate.setDate(itemEndDate.getDate() + interval);
    }
    return false;
  };

  switch (item.repeat) {
    case 'never':
      return areIntervalsOverlapping(
        {start: parseISO(item.starts), end: parseISO(item.ends)},
        {start: startOfDay, end: endOfDay},
      );
    case 'daily':
      return checkRepeats(1);
      break;
    case 'weekly':
      return checkRepeats(7);
      break;
    case 'fortnightly':
      return checkRepeats(14);
      break;
    case 'monthly':
      for (let i = 0; i < 50; i++) {
        itemStartDate.setMonth(itemStartDate.getMonth() + 1);
        itemEndDate.setMonth(itemEndDate.getMonth() + 1);

        if (
          areIntervalsOverlapping(
            {start: itemStartDate, end: itemEndDate},
            {start: startOfDay, end: endOfDay},
          )
        ) {
          return true;
        }
      }
      return false;
  }
};

const Day = ({route, navigation}) => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState('');
  const [userLookUp, setUserLookUp] = useState({});
  const {day} = route.params;

  const [absences, setAbsences] = useState([]);
  const [shifts, setShifts] = useState([]);

  const handlePreviousDayPress = () => {
    const daydate = new Date(day);
    daydate.setDate(daydate.getDate() - 1);
    navigation.navigate('Day', {day: daydate.toDateString()});
  };
  const handleNextDayPress = () => {
    const daydate = new Date(day);
    daydate.setDate(daydate.getDate() + 1);
    navigation.navigate('Day', {day: daydate.toDateString()});
  };

  React.useEffect(() => {
    const userRef = database.ref('users/' + user.uid);
    userRef.once('value').then(snapshot => {
      setUserInfo(snapshot.val());
      const teamid = snapshot.val().team;

      const usersRef = database.ref('/users/');
      usersRef
        .orderByChild('team')
        .equalTo(teamid)
        .once('value', snapshot => {
          const users = [];
          snapshot.forEach(function (childSnapshot) {
            users.push(childSnapshot.val());
          });

          // creating a user id look-up object
          users.forEach(user => {
            setUserLookUp(prevState => ({...prevState, [user['Id']]: user}));
          });
        });

      const requestsRef = database.ref('teams/' + teamid + '/requests/');
      requestsRef
        .orderByChild('status')
        .equalTo('accepted')
        .on('value', snapshot => {
          setAbsences([]);

          snapshot.forEach(function (childSnapshot) {
            setAbsences(absences => [...absences, childSnapshot.val()]);
          });
        });

      const shiftsRef = database.ref('teams/' + teamid + '/rota/');
      shiftsRef.on('value', snapshot => {
        setShifts([]);
        snapshot.forEach(function (childSnapshot) {
          {
            setShifts(shifts => [...shifts, childSnapshot.val()]);
          }
        });
      });
    });

    const teamid = userInfo.team;
    const requestsRef = database.ref('teams/' + teamid + '/requests/');
    const shiftsRef = database.ref('teams/' + teamid + '/rota/');

    const OnLoadingListener = requestsRef
      .orderByChild('status')
      .equalTo('accepted')
      .on('value', snapshot => {
        setAbsences([]);

        snapshot.forEach(function (childSnapshot) {
          setAbsences(absences => [...absences, childSnapshot.val()]);
        });
      });

    const ShiftsListener = shiftsRef.on('value', snapshot => {
      setShifts([]);
      snapshot.forEach(function (childSnapshot) {
        {
          setShifts(shifts => [...shifts, childSnapshot.val()]);
        }
      });
    });
    const count = 0;
    return () => {
      setUserInfo({}); // This worked for me
      userRef.off('value', OnLoadingListener);
      userRef.off('value', ShiftsListener);
    };
  }, []);
  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, padding: SIZES.padding}}>
      <View style={styles.dateContainer}>
        <Pressable
          style={styles.dateBtn}
          onPress={() => {
            handlePreviousDayPress();
          }}>
          <PREVIOUS />
        </Pressable>
        <Text style={[styles.date, FONTS.h2]}>{day}</Text>
        <Pressable
          style={styles.dateBtn}
          onPress={() => {
            handleNextDayPress();
          }}>
          <NEXT />
        </Pressable>
      </View>
      <View></View>
      <View>
        {/* <EditDayShifts day={day} /> */}
        <View style={APPSTYLES.itemContainer}>
          <Text style={FONTS.h2}>Rota</Text>

          {shifts.map((shift, index) => (
            <View>
              {areIntervalsOverlapping(
                {
                  start: parseISO(shift.starts),
                  end: parseISO(shift.ends),
                },
                {
                  start: startOfDay(new Date(day)),
                  end: endOfDay(new Date(day)),
                },
              ) ? (
                <View>
                  {shift.assignedEmployees.map((employee, index) => (
                    <View style={styles.shiftInfo}>
                      <View
                        style={{
                          borderBottomColor: COLOURS.grey,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                      />
                      <ShiftItem employee={employee} shift={shift} />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <View style={APPSTYLES.itemContainer}>
        <View>
          <Text style={FONTS.h2}>Staff Absences</Text>
        </View>
        {absences.map((item, index) => (
          <View>
            {checkSameDay(
              startOfDay(new Date(day)),
              endOfDay(new Date(day)),
              item,
            ) ? (
              <View>
                <View
                  style={{
                    borderBottomColor: COLOURS.grey,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
                <TimeOffInfo inputs={item} />
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.white,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  dateBtn: {
    paddingHorizontal: 15,
  },
  date: {},
  shiftInfo: {},
  shiftContainer: {
    borderRadius: SIZES.radius,
    borderColor: COLOURS.paleGreen,
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
});

export default Day;
