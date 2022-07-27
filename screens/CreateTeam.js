import React, {useState} from 'react';
import {
  Text,
  View,
  Keyboard,
  StyleSheet,
  Button,
  Pressable,
} from 'react-native';
import Input from '../components/Input';
import BigButton from '../components/BigButton';
import {
  assignTeamToUser,
  createNewTeam,
  joinTeamWithJoinCode,
  addEmployeeDetails,
} from '../apiService';
import auth from '@react-native-firebase/auth';
import {handleSignOut} from '../authService';
import {generateTeamCode} from '../teamCodes';
import RadioButtons from '../components/RadioButtons';
import EnterJoinCode from './EnterJoinCode';
import {SmallButton} from '../components/SmallButton';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import COLOURS from '../conts/colours';

const CreateTeam = ({navigation}) => {
  // [teamName, setTeamName] = useState();

  const [errors, setErrors] = React.useState({});
  const [inputs, setInputs] = React.useState({
    teamName: '',
    hours: '',
    joinCode: '',
  });
  const user = auth().currentUser;
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  // const [joinCode, setJoinCode] = useState('');
  // const childToParent = isAdmin => {
  //   setIsAdmin(isAdmin);
  // };

  const childToParent = code => {
    handleOnchange(code, 'joinCode');
    //change start time in date
  };

  const handleConfirmUser = () => {
    addEmployeeDetails(user.uid, isAdmin, inputs.hours);
  };

  async function handleCreateTeam() {
    await Promise.all([
      (teamid = createNewTeam(inputs.teamName, user.uid)),
      assignTeamToUser(user.uid, teamid),
      handleConfirmUser(),
    ]);
    navigation.navigate('MainApp');
  }

  async function handleJoinTeam() {
    await Promise.all([
      joinTeamWithJoinCode(user.uid, inputs.joinCode),
      handleConfirmUser(),
    ]);
    navigation.navigate('MainApp');
  }
  const validateCreateTeam = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.teamName) {
      handleError('Please enter the name of your business.', 'teamName');
      isValid = false;
    }
    if (!inputs.hours) {
      handleError(
        'Please enter your weekly hours. This can be changed later.',
        'hours',
      );
      isValid = false;
    }
    if (isValid) {
      handleCreateTeam();
    }
  };
  const validateJoinTeam = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.hours) {
      handleError(
        'Please enter your weekly hours. This can be changed later.',
        'hours',
      );
      isValid = false;
    }
    if (!inputs.joinCode) {
      handleError('Please enter a join code', 'joinCode');
      isValid = false;
    }

    if (isValid) {
      handleJoinTeam();
      console.log('gone thru validate');
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <View style={styles.screen}>
      <View>
        <View style={APPSTYLES.titleContainer}>
          <Text style={FONTS.h2}>Welcome to ShiftWhizz!</Text>
          <Text style={FONTS.h3}>We just need a couple more things...</Text>
        </View>
        <Input
          keyboardType="numeric"
          onChangeText={text => handleOnchange(text, 'hours')}
          onFocus={() => handleError(null, 'hours')}
          iconName="time-outline"
          iconFocused="time"
          label="How many hours per week do you wish to work?"
          placeholder="Enter your weekly hours"
          error={errors.hours}
          value={inputs.hours}
        />

        <RadioButtons
          onValueChange={value => {
            setIsAdmin(value);
          }}
          value={isAdmin}
        />

        {isAdmin ? (
          <View>
            <Input
              onChangeText={text => handleOnchange(text, 'teamName')}
              onFocus={() => handleError(null, 'teamName')}
              iconName="shop"
              label="Enter the name of your team."
              value={inputs.teamName}
              placeholder="My Business"
              error={errors.teamName}
              entypo
            />
          </View>
        ) : (
          <View>
            <EnterJoinCode
              childToParent={childToParent}
              error={errors.joinCode}
            />
          </View>
        )}
      </View>
      <View style={{marginBottom: 10}}>
        <BigButton
          title="Submit"
          onPress={() => (isAdmin ? validateCreateTeam() : validateJoinTeam())}
        />

        <Pressable
          onPress={() => handleSignOut()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={APPSTYLES.buttonText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: '#0000EE',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  screen: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLOURS.white,
  },
});

export default CreateTeam;
