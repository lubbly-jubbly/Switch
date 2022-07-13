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
import BigButton from '../components/BigButton';
import Toggle from '../components/Toggle';
import RepeatPicker from '../components/RepeatPicker';
import DatePicker from '../components/DatePicker';
import {submitTimeOffRequest} from '../apiService';

const RequestTimeOff = ({navigation}) => {
  const [inputs, setInputs] = useState({
    reason: '',
    isAllDay: false,
    starts: '',
    ends: '',
    repeat: 'never',
    notes: '',
  });

  async function handleSubmit() {
    await submitTimeOffRequest(null, inputs);
    alert('request sent!');
    navigation.goBack();
  }

  const childToParent = toggleEnabled => {
    handleOnchange(toggleEnabled, 'isAllDay');
    //change start time in date
  };

  const startDateToParent = date => {
    handleOnchange(date, 'starts');
  };
  const endDateToParent = date => {
    handleOnchange(date, 'ends');
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
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
            <Input
              placeholder="Reason for absence"
              value={inputs.reason}
              onChangeText={text => handleOnchange(text, 'reason')}
            />
            <Toggle label="All-day" childToParent={childToParent} />
            <DatePicker
              label="From..."
              timeRequired={!inputs.isAllDay}
              dateToParent={startDateToParent}
            />
            <DatePicker
              label="To..."
              timeRequired={!inputs.isAllDay}
              dateToParent={endDateToParent}
            />
            <RepeatPicker
              setValue={v => handleOnchange(v(), 'repeat')}
              value={inputs.repeat}
            />
            <Input
              placeholder="Notes for employer (optional)"
              value={inputs.notes}
              onChangeText={text => handleOnchange(text, 'notes')}
            />
            <BigButton title="Submit Request" onPress={() => handleSubmit()} />
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
