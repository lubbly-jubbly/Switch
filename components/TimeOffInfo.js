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

const TimeOffInfo = ({navigation, inputs}) => {
  const [senderName, setSenderName] = useState();
  const [senderAbbrevName, setSenderAbbrevName] = useState();
  const [senderColour, setSenderColour] = useState();

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
        setSenderAbbrevName(
          snapshot.child('firstname').val() +
            ' ' +
            snapshot.child('lastname').val()[0],
        );
        setSenderColour(snapshot.child('colour').val());
      });
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userNameContainer}>
        <UserName name={senderAbbrevName} colour={senderColour} />
        <Text style={FONTS.body3}>{inputs.reason}</Text>
      </View>
      {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
        <View style={[styles.singleDayDateContainer, styles.textBubble]}>
          {!inputs.isAllDay ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                {format(parseISO(inputs.starts), 'p')}
              </Text>
              <SMALLNEXT />
              <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                {format(parseISO(inputs.ends), 'p')}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.multiDayDateContainer}>
          <DOWNARROW />
          <View>
            <View style={[styles.dateAndTime, styles.textBubble]}>
              <Text style={FONTS.body3}>
                {format(parseISO(inputs.starts), 'eee d MMM')}
                {'  '}
              </Text>
              {!inputs.isAllDay ? (
                <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                  {format(parseISO(inputs.starts), 'p')}
                </Text>
              ) : (
                <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                  All day
                </Text>
              )}
            </View>

            <View style={[styles.dateAndTime, styles.textBubble]}>
              <Text style={FONTS.body3}>
                {format(parseISO(inputs.ends), 'eee d MMM')}
                {'  '}
              </Text>
              {!inputs.isAllDay ? (
                <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                  {format(parseISO(inputs.ends), 'p')}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  singleDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 2,
  },
  multiDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    paddingVertical: 2,
  },
  dateAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 138,
  },
  // container: {
  //   backgroundColor: COLOURS.light,
  //   marginVertical: 10,
  //   flexDirection: 'row',
  //   paddingVertical: 10,
  // },
  infoContainer: {
    // backgroundColor: COLOURS.grey,
    flex: 1,
  },
  dateContainer: {
    // backgroundColor: COLOURS.red,
    flex: 1,
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
