import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import EditTeam from './EditTeam';
import COLOURS from '../conts/colours';
import {APPSTYLES, FONTS, MODALSTYLES, SIZES} from '../conts/theme';
import {database, editUserInfo} from '../apiService';
import {CANCEL, EDIT, EMAIL, PHONE} from '../conts/icons';
import {} from 'react-native-paper';
import {SmallButton} from '../components/SmallButton';
import Input from '../components/Input';

const EditDetails = ({navigation, route}) => {
  //   const [userInfo, setUserInfo] = useState({});
  const {firstname, lastname, hours, phone, email, id} = route.params;
  console.log(id);
  //   const [userId, setUserId] = useState(id);
  const [inputs, setInputs] = React.useState({
    firstname: firstname,
    lastname: lastname,
    hours: hours,
    phone: phone,
    email: email,
  });
  const [errors, setErrors] = React.useState({});
  console.log(firstname);

  const confirmChanges = () => {
    editUserInfo(id, inputs);
    navigation.goBack();
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <View
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <View>
        <Text
          style={[FONTS.modalText, {textAlign: 'center', marginBottom: 15}]}>
          Edit details
        </Text>

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
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="mail-outline"
            iconFocused="mail"
            label="Email"
            value={inputs.email}
            placeholder="Enter your email address"
            error={errors.email}
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

      <SmallButton onPress={() => confirmChanges()} title="Confirm Changes" />
    </View>
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
