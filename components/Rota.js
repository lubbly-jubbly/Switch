import React from 'react';
import {Calendar} from 'react-native-calendars';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {parseISO} from 'date-fns';

const Rota = ({navigation}) => {
  const preferenceAgainst = {
    key: 'preference-against',
    color: 'red',
  };
  const preferenceFor = {
    key: 'preference-for',
    color: 'green',
  };
  const closed = {
    dots: [],
    selected: true,
    selectedColor: 'grey',
  };
  const onShift = {
    dots: [],
    selected: true,
    selectedColor: 'orange',
  };

  return (
    <>
      <Calendar
        minDate={new Date()}
        onMonthChange={month => {
          console.log('month changed', month);
        }}
        onDayPress={daydate => {
          const day = new Date(daydate.dateString).toDateString();
          navigation.navigate('Day', {day: day});
        }}
        firstDay={1}
        enableSwipeMonths={true}
        markingType={'multi-dot'}
        // markedDates={{
        //   '2022-06-21': {
        //     dots: [preferenceAgainst, preferenceFor],
        //   },
        //   '2022-06-22': closed,
        //   '2022-06-23': onShift,
        // }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Rota;
