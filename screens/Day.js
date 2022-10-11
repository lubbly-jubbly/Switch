import auth from '@react-native-firebase/auth';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import endOfDay from 'date-fns/endOfDay';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {database} from '../apiService';
import ShiftItem from '../components/ShiftItem';
import TimeOffInfo from '../components/TimeOffInfo';
import COLOURS from '../conts/colours';
import {NEXT, PREVIOUS} from '../conts/icons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import {checkSameDay} from '../checkSameDay';

/* Day details screen. Contains rota and absence details for an individual day. */
const Day = ({route, navigation}) => {
  const user = auth().currentUser;
  /* Receives day parameter from page that it was navigated to from. */
  const {day} = route.params;
  const [userInfo, setUserInfo] = React.useState('');
  const [absences, setAbsences] = useState([]);
  const [shifts, setShifts] = useState([]);

  /* Called when user presses back chevron. Navigates to previous day. */
  const handlePreviousDayPress = () => {
    const daydate = new Date(day);
    daydate.setDate(daydate.getDate() - 1);
    navigation.navigate('Day', {day: daydate.toDateString()});
  };

  /* Called when user presses forward chevron. Navigates to next day. */
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
      // Fetches user info for all team members.
      const usersRef = database.ref('/users/');
      usersRef
        .orderByChild('team')
        .equalTo(teamid)
        .once('value', snapshot => {
          const users = [];
          snapshot.forEach(function (childSnapshot) {
            users.push(childSnapshot.val());
          });
        });

      // Fetches all accepted time off requests for the team
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
      // Fetches all shift info for the team
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
    // Listens for changes to requests node and updates view.
    const OnLoadingListener = requestsRef
      .orderByChild('status')
      .equalTo('accepted')
      .on('value', snapshot => {
        setAbsences([]);

        snapshot.forEach(function (childSnapshot) {
          setAbsences(absences => [...absences, childSnapshot.val()]);
        });
      });
    // Listens for changes to shifts node and updates view.
    const ShiftsListener = shiftsRef.on('value', snapshot => {
      setShifts([]);
      snapshot.forEach(function (childSnapshot) {
        {
          setShifts(shifts => [...shifts, childSnapshot.val()]);
        }
      });
    });
    return () => {
      setUserInfo({});
      userRef.off('value', OnLoadingListener);
      userRef.off('value', ShiftsListener);
    };
  }, []);
  return (
    <ScrollView style={styles.container}>
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
        <View style={APPSTYLES.itemContainerWhite}>
          {shifts.length > 0 ? (
            <View>
              <Text style={FONTS.h2}>Rota</Text>
              {shifts.map((shift, index) => (
                <View>
                  {/* Checks if shift is on this day; if so, it is displayed on the screen. */}
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
                          <View style={APPSTYLES.line} />
                          <ShiftItem employee={employee} shift={shift} />
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text style={FONTS.h2}>Rota to be confirmed.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={APPSTYLES.itemContainerWhite}>
        <View>
          <Text style={FONTS.h2}>Staff Absences</Text>
        </View>
        {absences.map((item, index) => (
          <View>
            {/* Checks if absence is on this day; if so, it is displayed on the screen. */}

            {checkSameDay(
              startOfDay(new Date(day)),
              endOfDay(new Date(day)),
              item,
            ) ? (
              <View>
                <View style={APPSTYLES.line} />
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
  container: {backgroundColor: COLOURS.white, padding: SIZES.padding},

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
