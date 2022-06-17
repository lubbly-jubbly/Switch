import React from 'react';
import {Text, View} from 'react-native';
import DatePicker from '../components/DatePicker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Profile = () => {
  return (
    <View>
      <DateTimePicker value={new Date()} />
      <DateTimePicker value={new Date()} mode="time" />
    </View>
  );
};

export default Profile;
