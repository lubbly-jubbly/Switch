import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {StyleSheet, Button, Text, View} from 'react-native';
import Rota from '../components/Rota';

const Day = ({route, navigation}) => {
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

  const {day} = route.params;
  const d = new Date();
  return (
    <View style={styles.container}>
      <Button
        title="<"
        onPress={() => {
          handlePreviousDayPress();
        }}
      />
      <Text>{day}</Text>
      <Button
        title=">"
        onPress={() => {
          handleNextDayPress();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 30,
  },
});

export default Day;
