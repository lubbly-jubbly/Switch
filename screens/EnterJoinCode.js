import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import Button from '../components/Button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import {handleSignOut} from '../authService';
import {joinTeamWithJoinCode} from '../apiService';
const CELL_COUNT = 6;

const EnterJoinCode = () => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // const [errors, setErrors] = React.useState({});
  const user = auth().currentUser;

  const handleCodeSubmit = () => {
    joinTeamWithJoinCode(user.uid, value);
  };

  // const validate = async () => {
  //   Keyboard.dismiss();
  //   let isValid = true;
  //   if (!inputs.teamName) {
  //     handleError('Please enter the name of your business.', 'teamName');
  //     isValid = false;
  //   }
  //   if (isValid) {
  //     handleCreateTeam();
  //   }
  // };
  // const handleOnchange = (text, input) => {
  //   setInputs(prevState => ({...prevState, [input]: text}));
  // };

  // const handleError = (error, input) => {
  //   setErrors(prevState => ({...prevState, [input]: error}));
  // };
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Enter your team's code.</Text>
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      <Button title="Enter" onPress={handleCodeSubmit} />
      <Button title="signout" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default EnterJoinCode;
