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
import parseISO from 'date-fns/parseISO';

const TimeOffRequest = ({navigation, inputs}) => {
  const [senderName, setSenderName] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRejectRequest = () => {
    changeRequestStatus('rejected', inputs.Id);
    setModalVisible(!modalVisible);
  };

  const handleAcceptRequest = () => {
    changeRequestStatus('accepted', inputs.Id);
    setModalVisible(!modalVisible);
  };

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
    console.log(parseISO(inputs.starts));
    return () => {};
  }, []);

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
            <Text style={FONTS.userName}>{senderName}</Text>
            <Text style={FONTS.p3}>{inputs.reason}</Text>
            <Text>{inputs.starts}</Text>
            <Text>{inputs.ends}</Text>
            {inputs.allDay ? <Text>All day</Text> : null}
            <Text>{inputs.repeat}</Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleRejectRequest()}>
              <Text style={styles.textStyle}>Reject Request</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleAcceptRequest()}>
              <Text style={styles.textStyle}>Accept Request</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

export default TimeOffRequest;
