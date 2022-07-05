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
import {FONTS} from '../conts/theme';
import format from 'date-fns/format';
import {changeRequestStatus} from '../apiService';

const TimeOffInfo = ({navigation, inputs}) => {
  const [senderName, setSenderName] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    database
      .ref('/users/' + inputs.sender)
      .once('value')
      .then(snapshot => {
        setSenderName(
          snapshot.child('firstname').val() +
            ' ' +
            snapshot.child('lastname').val(),
        );
      });

    return () => {};
  }, []);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}>
        <View style={styles.infoContainer}>
          <Text style={FONTS.userName}>{senderName}</Text>
          <Text style={FONTS.p3}>{inputs.reason}</Text>
        </View>
        <View style={styles.dateContainer}>
          {/* <Text>From {format(new Date(inputs.starts), 'PPPPpppp')}</Text> */}
          <Text>until {inputs.ends}</Text>
          {inputs.allDay ? <Text>All day</Text> : null}
          <Text>{inputs.repeat}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.light,
    marginVertical: 10,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  infoContainer: {
    // backgroundColor: COLOURS.grey,
    flex: 1,
  },
  dateContainer: {
    // backgroundColor: COLOURS.red,
    flex: 1,
  },
  button: {
    height: 55,
    width: '100%',
    backgroundColor: COLOURS.light,
    marginVertical: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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

export default TimeOffInfo;
