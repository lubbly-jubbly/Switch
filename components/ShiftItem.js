import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import {userIsAdmin} from '../apiService';
import COLOURS from '../conts/colours';
import {database} from '../apiService';
import {APPSTYLES, FONTS} from '../conts/theme';
import format from 'date-fns/format';
import {changeRequestStatus} from '../apiService';
import {UserName} from './UserName';
import {isSameDay, parseISO} from 'date-fns';
import {BIGCLOCK, DOWNARROW, SMALLNEXT} from '../conts/icons';

const ShiftItem = ({navigation, employee, shift}) => {
  const [employeeName, setEmployeeName] = useState();
  const [employeeAbbrevName, setEmployeeAbbrevName] = useState();
  const [employeeColour, setEmployeeColour] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    database
      .ref('/users/' + employee)
      .once('value')
      .then(snapshot => {
        setEmployeeName(
          snapshot.child('firstname').val() +
            ' ' +
            snapshot.child('lastname').val(),
        );
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
  userNameContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
