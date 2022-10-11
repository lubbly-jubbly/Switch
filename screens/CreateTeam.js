import auth from '@react-native-firebase/auth';
import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  addEmployeeDetails,
  assignTeamToUser,
  createNewTeam,
  joinTeamWithJoinCode,
} from '../apiService';
import {handleSignOut} from '../authService';
import BigButton from '../components/BigButton';
import Input from '../components/Input';
import RadioButtons from '../components/RadioButtons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import EnterJoinCode from '../components/EnterJoinCode';
import {database} from '../apiService';

/* Create/Join team screen. Navigated to after signup. */
const CreateTeam = ({navigation}) => {
  const [errors, setErrors] = React.useState({});
  const [inputs, setInputs] = React.useState({
    teamName: '',
    hours: '',
    joinCode: '',
  });
  const user = auth().currentUser;
  const [isAdmin, setIsAdmin] = React.useState(false);

  /* Receives join code from parent */
  const childToParent = code => {
    handleOnchange(code, 'joinCode');
  };

  /* Called when a user joins or creates a team. Adds inputted details to database. */
  const handleConfirmUser = () => {
    addEmployeeDetails(user.uid, isAdmin, inputs.hours);
  };

  /* Called by validateCreateTeam. 
  A new team is added to the database with the user as admin. */
  async function handleCreateTeam() {
    await Promise.all([
      (teamid = createNewTeam(inputs.teamName, user.uid)),
      assignTeamToUser(user.uid, teamid),
      handleConfirmUser(),
    ]);
    navigation.navigate('MainApp');
  }

  /* Called by validateJoinTeam. If the join code entered belongs to a team, 
  the user is added to the team. Otherwise, the user receives an alert. */
  const handleJoinTeam = () => {
    database.ref('/joinCodes/' + inputs.joinCode).once('value', snapshot => {
      if (snapshot.exists()) {
        joinTeamWithJoinCode(user.uid, inputs.joinCode),
          handleConfirmUser(),
          navigation.navigate('MainApp');
      } else {
        Alert.alert("The join code you've entered is invalid.");
      }
    });
  };

  /* Called if a user presses confirm with the "create team" radio button checked. 
  Checks that all fields are filled. */
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

  /* Called if a user presses confirm with the "join team" radio button checked. 
  Checks that all fields are filled. */
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
    }
  };

  /* Called when user edits a field. Adds input to inputs state variable. */
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  /* Called by validateCreateTeam and validateJoinTeam. 
  Adds error to errors state variable in order to notify user of error. */
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={APPSTYLES.titleContainer}>
              <Text style={FONTS.h2}>Welcome to Switch!</Text>
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

            <View style={styles.bottomMargin}>
              <BigButton
                title="Submit"
                onPress={() =>
                  isAdmin ? validateCreateTeam() : validateJoinTeam()
                }
              />

              <Pressable
                onPress={() => {
                  handleSignOut(), Keyboard.dismiss;
                }}
                style={styles.rowFlex}>
                <Text style={APPSTYLES.buttonText}>Sign out</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 30,
  },
  rowFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomMargin: {marginBottom: 10},
  link: {
    color: '#0000EE',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  screen: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },

  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default CreateTeam;
