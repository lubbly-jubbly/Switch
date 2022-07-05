import React, {useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {StyleSheet, Button, Text, View} from 'react-native';
import Rota from '../components/Rota';
import COLOURS from '../conts/colours';
import TimeOffInfo from '../components/TimeOffInfo';
import auth from '@react-native-firebase/auth';
import {database} from '../apiService';
import {FONTS, SIZES} from '../conts/theme';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import parseISO from 'date-fns/parseISO';

const Day = ({route, navigation}) => {
  const user = auth().currentUser;
  const [userInfo, setUserInfo] = React.useState('');

  const {day} = route.params;
  const [absences, setAbsences] = useState([]);

  const checkSameDay = item => {
    //set up day interval
    const startOfDay = new Date(day);
    const endOfDay = new Date(day);
    endOfDay.setHours(24, 59);
    console.log(endOfDay);

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
    });

    const teamid = userInfo.team;
    const requestsRef = database.ref('teams/' + teamid + '/requests/');

    const OnLoadingListener = requestsRef
      .orderByChild('status')
      .equalTo('accepted')
      .on('value', snapshot => {
        setAbsences([]);

        snapshot.forEach(function (childSnapshot) {
          setAbsences(absences => [...absences, childSnapshot.val()]);
        });
      });

    return () => {
      setUserInfo({}); // This worked for me
      userRef.off('value', OnLoadingListener);
    };
  }, []);

  return (
    <View>
      <View style={styles.dateContainer}>
        <Button
          style={styles.dateBtn}
          title="<"
          onPress={() => {
            handlePreviousDayPress();
          }}
        />
        <Text style={styles.date}>{day}</Text>
        <Button
          style={styles.dateBtn}
          title=">"
          onPress={() => {
            handleNextDayPress();
          }}
        />
      </View>
      <View>
        <Text style={FONTS.h2}>Staff Absences</Text>
      </View>
      {absences.map((item, index) => (
        <View>{checkSameDay(item) ? <TimeOffInfo inputs={item} /> : null}</View>
      ))}
    </View>
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
    paddingTop: 30,
  },
  dateBtn: {
    backgroundColor: COLOURS.red,
  },
  date: {
    backgroundColor: COLOURS.red,
  },
});

export default Day;
