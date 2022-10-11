import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {submitTimeOff} from '../apiService';
import BigButton from '../components/BigButton';
import DatePicker from '../components/DatePicker';
import Input from '../components/Input';
import RepeatPicker from '../components/RepeatPicker';
import Toggle from '../components/Toggle';
import COLOURS from '../conts/colours';

/* Mark time off screen (admin only) */
const MarkTimeOff = ({navigation}) => {
  const [inputs, setInputs] = useState({
    reason: '',
    isAllDay: false,
    starts: '',
    ends: '',
    repeat: 'never',
    notes: '',
  });

  /* Called when user submits absence. Adds absence to database */
  async function handleSubmit() {
    await submitTimeOff(null, inputs, 'accepted');
    alert('Absence marked!');
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
            Select time off
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

            <BigButton title="Submit Time Off" onPress={() => handleSubmit()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MarkTimeOff;
