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
import {FONTS, SIZES} from '../conts/theme';
import format from 'date-fns/format';
import {changeRequestStatus} from '../apiService';
import parseISO from 'date-fns/parseISO';
import isSameDay from 'date-fns/isSameDay';
import {UserName} from './UserName';

const MyRequest = ({navigation, inputs}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleRejectRequest = () => {
    changeRequestStatus('rejected', inputs.Id);
    setModalVisible(!modalVisible);
  };

  const handleAcceptRequest = () => {
    changeRequestStatus('accepted', inputs.Id);
    setModalVisible(!modalVisible);
  };

  function dateSwitch(sameDay, repeat) {
    switch (sameDay) {
      case true:
        switch (repeat) {
          case 'never':
          // return (
          //   format(parseISO(inputs.starts), 'eeee do MMM') +
          //   ', ' +
          //   '\n' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'monthly':
            return (
              <View>
                <Text style={FONTS.h3}>
                  {format(parseISO(inputs.starts), 'do')},
                </Text>

                <Text style={{color: COLOURS.darkGrey}}>
                  {format(parseISO(inputs.starts), 'p')} -
                  {format(parseISO(inputs.ends), 'p')}
                </Text>
              </View>
            );
          case 'fortnightly':
          // return (
          //   format(parseISO(inputs.starts), 'eeee') +
          //   ', ' +
          //   '\n' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'weekly':
          // return (
          //   format(parseISO(inputs.starts), 'eeee') +
          //   ', ' +
          //   '\n' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'daily':
          // return (
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
        }

      case false:
        switch (repeat) {
          case 'never':
          // return (
          //   format(parseISO(inputs.starts), 'eeee do MMM') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'eeee do MMM') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'monthly':
          // return (
          //   format(parseISO(inputs.starts), 'do') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   '\n' +
          //   format(parseISO(inputs.ends), 'do') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'fortnightly':
          // return (
          //   format(parseISO(inputs.starts), 'eeee') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'eeee') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'weekly':
          // return (
          //   format(parseISO(inputs.starts), 'eeee') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'eeee') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
        }
    }
  }

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
        {/* <View style={styles.infoContainer}> */}
        <View style={{flexDirection: 'row'}}>
          <Text style={FONTS.p3}>{inputs.reason}</Text>
        </View>
        <View style={styles.dateContainer}>
          <View>
            {dateSwitch(
              isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)),
              inputs.repeat,
            )}
          </View>
          {inputs.allDay ? <Text>All day</Text> : null}
          {inputs.repeat !== 'never' ? (
            <Text>Repeat: {inputs.repeat}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userNameContainer: {},

  container: {
    backgroundColor: COLOURS.light,
    borderRadius: SIZES.radius,
    marginVertical: 10,
    flexDirection: 'column',
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

export default MyRequest;
