import React from 'react';
import {ScrollView, StyleSheet, View, Keyboard} from 'react-native';
import {} from 'react-native-paper';
import {editUserInfo} from '../apiService';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import COLOURS from '../conts/colours';
import {SIZES} from '../conts/theme';

/* Edit details screen. */
const EditDetails = ({navigation, route}) => {
  const {firstname, lastname, hours, phone, id} = route.params;
  const [inputs, setInputs] = React.useState({
    firstname: firstname,
    lastname: lastname,
    hours: hours,
    phone: phone,
  });
  const [errors, setErrors] = React.useState({});

  /* Called by validate.
   Modifies user's database node according to changes. */
  const confirmChanges = () => {
    editUserInfo(id, inputs);
    navigation.goBack();
  };

  /* Called when the user presses submit button. Checks that all fields are still
   filled out  */
  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.firstname) {
      handleError('Please enter your first name.', 'firstname');
      isValid = false;
    }
    if (!inputs.lastname) {
      handleError('Please enter your last name.', 'lastname');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please enter your phone number.', 'phone');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please enter your weekly hours.', 'hours');
      isValid = false;
    }

    if (isValid) {
      confirmChanges();
    }
  };

  /* Called when user edits a field. Adds input to inputs state variable. */
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  /* Called by validate. Adds error to errors state variable in order to notify user of error. */
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <ScrollView
      style={{
        backgroundColor: COLOURS.white,
        flex: 1,
        padding: SIZES.padding,
      }}>
      <View style={{paddingBottom: 60}}>
        <View>
          <View style={styles.inputContainer}>
            <Input
              onChangeText={text => handleOnchange(text, 'firstname')}
              onFocus={() => handleError(null, 'firstname')}
              iconName="person-outline"
              iconFocused="person"
              label="First Name"
              placeholder="Enter your first name"
              error={errors.firstname}
              value={inputs.firstname}
            />

            <Input
              onChangeText={text => handleOnchange(text, 'lastname')}
              onFocus={() => handleError(null, 'lastname')}
              iconName="person-outline"
              iconFocused="person"
              label="Last Name"
              placeholder="Enter your last name"
              error={errors.lastname}
              value={inputs.lastname}
            />

            <Input
              keyboardType="numeric"
              onChangeText={text => handleOnchange(text, 'hours')}
              onFocus={() => handleError(null, 'hours')}
              iconName="time-outline"
              iconFocused="time"
              label="Weekly hours"
              placeholder="Enter your weekly hours"
              error={errors.hours}
              value={inputs.hours.toString()}
            />

            <Input
              keyboardType="numeric"
              onChangeText={text => handleOnchange(text, 'phone')}
              onFocus={() => handleError(null, 'phone')}
              iconName="call-outline"
              iconFocused="call"
              label="Phone Number"
              placeholder="Enter your phone no"
              error={errors.phone}
              value={inputs.phone}
            />
          </View>
        </View>

        <BigButton onPress={() => validate()} title="Confirm Changes" />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLOURS.light,
    flexDirection: 'column',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'column',
  },

  infoContainer: {},
  btnContainer: {},

  individualContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  individualContact: {
    marginLeft: 7,
  },
  infoListContainer: {
    marginTop: 5,
  },
  infoItem: {
    marginVertical: 5,
  },
  weeklyHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyHours: {},
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default EditDetails;
