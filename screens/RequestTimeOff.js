import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {submitTimeOff} from '../apiService';
import BigButton from '../components/BigButton';
import DatePicker from '../components/DatePicker';
import Input from '../components/Input';
import RepeatPicker from '../components/RepeatPicker';
import Toggle from '../components/Toggle';
import COLOURS from '../conts/colours';

/* Request time off screen (employee only) */
const RequestTimeOff = ({navigation}) => {
  const [inputs, setInputs] = useState({
    reason: '',
    isAllDay: false,
    starts: '',
    ends: '',
    repeat: 'never',
    notes: '',
  });

  /* Called when user presses submit. Adds request to database with pending status. */
  async function handleSubmit() {
    await submitTimeOff(null, inputs, 'pending');
    alert('request sent!');
    navigation.goBack();
  }

  /* Receives All-day toggle input */
  const childToParent = toggleEnabled => {
    handleOnchange(toggleEnabled, 'isAllDay');
  };

  /* Receives date picker input */
  const startDateToParent = date => {
    handleOnchange(date, 'starts');
  };
  /* Receives date picker input */
  const endDateToParent = date => {
    handleOnchange(date, 'ends');
  };

  /* Called when user edits a field. Adds input to inputs state variable. */
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

export default RequestTimeOff;
