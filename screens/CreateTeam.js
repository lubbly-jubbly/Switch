import React, {useState} from 'react';
import {Text, View, Keyboard} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import {assignTeamToUser, createNewTeam} from '../apiService';
import auth from '@react-native-firebase/auth';
import {handleSignOut} from '../authService';
import {generateTeamCode} from '../teamCodes';

const CreateTeam = () => {
  // [teamName, setTeamName] = useState();
  const [errors, setErrors] = React.useState({});
  const [inputs, setInputs] = React.useState({teamName: ''});
  const user = auth().currentUser;

  const handleCreateTeam = () => {
    teamid = createNewTeam(inputs.teamName, user.uid);
    console.log(teamid);
    assignTeamToUser(user.uid, teamid);
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.teamName) {
      handleError('Please enter the name of your business.', 'teamName');
      isValid = false;
    }
    if (isValid) {
      handleCreateTeam();
    }
  };
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <View>
      <Text>Create New Team</Text>
      <Input
        onChangeText={text => handleOnchange(text, 'teamName')}
        onFocus={() => handleError(null, 'teamName')}
        iconName="email-outline"
        label="Enter the name of your team."
        value={inputs.teamName}
        placeholder="My Business"
        error={errors.teamName}
      />
      <Button title="Submit" onPress={validate} />
      <Button title="signout" onPress={handleSignOut} />
    </View>
  );
};

export default CreateTeam;
