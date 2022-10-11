import {parseISO} from 'date-fns';
import format from 'date-fns/format';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {database} from '../apiService';
import COLOURS from '../conts/colours';
import {SMALLNEXT} from '../conts/icons';
import {FONTS} from '../conts/theme';
import UserName from './UserName';

/* Shift assignment component displayed as part of the rota details. */
const ShiftItem = ({navigation, employee, shift}) => {
  const [employeeAbbrevName, setEmployeeAbbrevName] = useState();
  const [employeeColour, setEmployeeColour] = useState();

  // Finding employee colour and name for the UserName component
  React.useEffect(() => {
    database
      .ref('/users/' + employee)
      .once('value')
      .then(snapshot => {
        setEmployeeAbbrevName(
          snapshot.child('firstname').val() +
            ' ' +
            snapshot.child('lastname').val()[0],
        );
        setEmployeeColour(snapshot.child('colour').val());
      });
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userNameContainer}>
        <UserName name={employeeAbbrevName} colour={employeeColour} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[{color: COLOURS.black}, FONTS.body3]}>
          {format(parseISO(shift.starts), 'p')}
        </Text>
        <SMALLNEXT />
        <Text style={[{color: COLOURS.black}, FONTS.body3]}>
          {format(parseISO(shift.ends), 'p')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ShiftItem;
