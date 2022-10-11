import {isSameDay, parseISO} from 'date-fns';
import format from 'date-fns/format';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {database} from '../apiService';
import {DOWNARROW, SMALLNEXT} from '../conts/icons';
import {APPSTYLES, FONTS} from '../conts/theme';
import UserName from './UserName';

/* Absence component displayed as part of an individual day's absence details. */
const TimeOffInfo = ({navigation, inputs}) => {
  const [senderAbbrevName, setSenderAbbrevName] = useState();
  const [senderColour, setSenderColour] = useState();

  // Finding employee colour and name for the UserName component
  React.useEffect(() => {
    database
      .ref('/users/' + inputs.sender)
      .once('value')
      .then(snapshot => {
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
              <Text style={[APPSTYLES.timeText, FONTS.body3]}>
                {format(parseISO(inputs.starts), 'p')}
              </Text>
              <SMALLNEXT />
              <Text style={[APPSTYLES.timeText, FONTS.body3]}>
                {format(parseISO(inputs.ends), 'p')}
              </Text>
            </View>
          ) : (
            <Text style={[APPSTYLES.timeText, FONTS.body3]}>All day</Text>
          )}
        </View>
      ) : (
        <View style={[styles.multiDayDateContainer, styles.textBubble]}>
          <DOWNARROW />
          <View style={{}}>
            <View style={[styles.dateAndTime]}>
              <Text style={FONTS.body3}>
                {format(parseISO(inputs.starts), 'eee d MMM')}
                {'  '}
              </Text>
              {!inputs.isAllDay ? (
                <Text style={[APPSTYLES.timeText, FONTS.body3]}>
                  {format(parseISO(inputs.starts), 'p')}
                </Text>
              ) : null}
            </View>

            <View style={[styles.dateAndTime, styles.textBubble]}>
              <Text style={FONTS.body3}>
                {format(parseISO(inputs.ends), 'eee d MMM')}
                {'  '}
              </Text>
              {!inputs.isAllDay ? (
                <Text style={[APPSTYLES.timeText, FONTS.body3]}>
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
  },
  infoContainer: {
    flex: 1,
  },
  dateContainer: {
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
