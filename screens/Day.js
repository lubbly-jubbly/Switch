import React, {useState} from 'react';
import {Alert, Pressable, SafeAreaView} from 'react-native';
import {StyleSheet, Button, Text, View, ScrollView} from 'react-native';
import Rota from '../components/Rota';
import COLOURS from '../conts/colours';
import TimeOffInfo from '../components/TimeOffInfo';
import auth from '@react-native-firebase/auth';
import {database} from '../apiService';
import {FONTS, SIZES} from '../conts/theme';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import {EditDayShifts} from './ChooseShifts';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import Shift from '../components/Shift';
import {NEXT, PREVIOUS} from '../conts/icons';
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
      <View>
        <Text style={FONTS.h2}>Shifts</Text>
        {/* <EditDayShifts day={day} /> */}
        <View style={styles.shiftContainer}>
          {shifts.map((item, index) => (
            <View>
              {/* if (
            areIntervalsOverlapping(
              {
                start: parseISO(childSnapshot.val().starts),
                end: parseISO(childSnapshot.val().ends),
              },
              {start: startOfDay(new Date(day)), end: endOfDay(new Date(day))},
            )
          )
               */}
              {areIntervalsOverlapping(
                {
                  start: parseISO(item.starts),
                  end: parseISO(item.ends),
                },
                {
                  start: startOfDay(new Date(day)),
                  end: endOfDay(new Date(day)),
                },
              ) ? (
                <View>
                  {item.assignedEmployees.map((emp, index) => (
                    <View style={styles.shiftInfo}>
                      <Text>{userLookUp[emp].firstname}</Text>
                      <Text>
                        {format(parseISO(item.starts), 'p')} -{' '}
                        {format(parseISO(item.ends), 'p')}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>

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
            <TimeOffInfo inputs={item} />
          ) : null}
        </View>
      ))}
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
  shiftInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shiftContainer: {
    borderRadius: SIZES.radius,
    borderColor: COLOURS.paleGreen,
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
});

export default Day;
