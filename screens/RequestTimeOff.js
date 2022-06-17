import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import COLOURS from '../conts/colours';
import {useForm, Controller} from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import RepeatPicker from '../components/RepeatPicker';
import DatePicker from '../components/DatePicker';

const RequestTimeOff = ({navigation}) => {
  const [isAllDay, setIsAllDay] = useState(false);
  const childToParent = toggleEnabled => {
    setIsAllDay(toggleEnabled);
  };
  return (
    <SafeAreaView style={{backgroundColor: COLOURS.white, flex: 1}}>
      <ScrollView>
        <View style={{paddingTop: 50, paddingHorizontal: 20}}>
          <Text
            style={{color: COLOURS.black, fontSize: 25, fontWeight: 'bold'}}>
            Request time off
          </Text>
          <View style={{marginVertical: 20}}>
            <Input placeholder="Reason for absence" />
            <Toggle label="All-day" childToParent={childToParent} />
            <DatePicker label="From..." timeRequired={!isAllDay} />
            <DatePicker label="To..." timeRequired={!isAllDay} />
            <RepeatPicker />
            <Input placeholder="Notes for employer (optional)" />
            <Button title="Submit Request" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'blue',
  },
});

export default RequestTimeOff;
