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
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import format from 'date-fns/format';
import {changeRequestStatus} from '../apiService';
import parseISO from 'date-fns/parseISO';
import isSameDay from 'date-fns/isSameDay';
import {UserName} from './UserName';
import {SmallCancelButton} from './SmallCancelButton';
import {SmallButton} from './SmallButton';
import {
  BIGCLOCK,
  CALENDAR,
  CANCEL,
  DOWNARROW,
  NEXT,
  REPEAT,
  SMALLNEXT,
} from '../conts/icons';

const TimeOffRequest = ({navigation, inputs}) => {
  const [senderName, setSenderName] = useState();
  const [senderAbbrevName, setSenderAbbrevName] = useState();

  const [senderColour, setSenderColour] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  const handleRejectRequest = () => {
    changeRequestStatus('rejected', inputs.Id);
    setModalVisible(!modalVisible);
  };

  const handleAcceptRequest = () => {
    changeRequestStatus('accepted', inputs.Id);
    setModalVisible(!modalVisible);
  };

  function testSwitch(sameDay) {
    switch (sameDay) {
      case true:
        return <Text>Hello</Text>;
      case false:
        return <Text>Go away</Text>;
    }
  }

  function dateSwitch(sameDay, repeat) {
    switch (sameDay) {
      case true:
        switch (repeat) {
          case 'never':
            return (
              // format(parseISO(inputs.starts), 'eeee d MMM') +
              // ' ' +
              // '\n' +
              // format(parseISO(inputs.starts), 'p') +
              // ' - ' +
              // format(parseISO(inputs.ends), 'p')
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
          // return (
          //   format(parseISO(inputs.starts), 'eeee d MMM') +
          //   ', ' +
          //   '\n' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
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
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 5,
                }}>
                <Text>Monthly, starting</Text>
                <View>
                  <Text>{format(parseISO(inputs.starts), 'eeee d MMM')}</Text>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: COLOURS.blue}}>
                      {format(parseISO(inputs.starts), 'p')}
                    </Text>
                    <SMALLNEXT />
                    <Text style={{color: COLOURS.blue}}>
                      {format(parseISO(inputs.ends), 'p')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          // return (
          //   format(parseISO(inputs.starts), 'eeee d MMM') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   ' - ' +
          //   format(parseISO(inputs.ends), 'eeee d MMM') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')

          // );

          case 'monthly':
          // return (
          //   'Every month \nFrom: ' +
          //   format(parseISO(inputs.starts), 'd') +
          //   ' at ' +
          //   format(parseISO(inputs.starts), 'p') +
          //   '\nTo: ' +
          //   format(parseISO(inputs.ends), 'd') +
          //   ' at ' +
          //   format(parseISO(inputs.ends), 'p')
          // );
          case 'fortnightly':
          // return (
          //   'Every 2 weeks \nFrom: ' +
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
            <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}
                style={{alignSelf: 'flex-end'}}>
                <CANCEL />
              </Pressable>
              <View style={{alignSelf: 'flex-start'}}>
                <UserName name={senderName} colour={senderColour} />
              </View>
              <Text style={FONTS.p3}>{inputs.reason}</Text>
              {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
                <View
                  style={[
                    styles.modalSingleDayDateContainer,
                    styles.textBubble,
                  ]}>
                  <View style={styles.rowFlex}>
                    <CALENDAR />
                    <Text style={FONTS.body3}>
                      {format(parseISO(inputs.starts), 'eeee d MMM')}
                      {'  '}
                    </Text>
                  </View>
                  <View style={styles.rowFlex}>
                    <BIGCLOCK />
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                        {format(parseISO(inputs.starts), 'p')}
                      </Text>
                      <SMALLNEXT />
                      {!inputs.isAllDay ? (
                        <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                          {format(parseISO(inputs.ends), 'p')}
                        </Text>
                      ) : null}
                    </View>
                  </View>
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
                      ) : null}
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

              {inputs.repeat !== 'never' ? (
                <View style={styles.repeatInfoContainer}>
                  <REPEAT />
                  <Text style={FONTS.body3}>
                    {inputs.repeat == 'daily'
                      ? 'Daily'
                      : inputs.repeat == 'weekly'
                      ? 'Weekly'
                      : inputs.repeat == 'fortnightly'
                      ? 'Every two weeks'
                      : inputs.repeat == 'monthly'
                      ? 'Monthly'
                      : null}
                  </Text>
                </View>
              ) : null}
              <View style={{flexDirection: 'row'}}>
                <SmallCancelButton
                  title="Reject"
                  onPress={() => handleRejectRequest()}
                />
                <SmallButton
                  title="Accept"
                  onPress={() => handleAcceptRequest()}
                />
                {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleRejectRequest()}>
                <Text style={styles.textStyle}>Reject Request</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleAcceptRequest()}>
                <Text style={styles.textStyle}>Accept Request</Text>
              </Pressable> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={APPSTYLES.itemContainer}
        onPress={() => setModalVisible(true)}>
        <View style={styles.userNameContainer}>
          <UserName name={senderAbbrevName} colour={senderColour} />
          <Text style={FONTS.body3}>{inputs.reason}</Text>
        </View>
        <View style={styles.dateContainer}>
          <View>
            {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
              <View style={[styles.singleDayDateContainer, styles.textBubble]}>
                <BIGCLOCK />
                <Text style={FONTS.body3}>
                  {format(parseISO(inputs.starts), 'eeee d MMM')}
                  {'  '}
                </Text>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                    {format(parseISO(inputs.starts), 'p')}
                  </Text>
                  <SMALLNEXT />
                  {!inputs.isAllDay ? (
                    <Text style={[{color: COLOURS.blue}, FONTS.body3]}>
                      {format(parseISO(inputs.ends), 'p')}
                    </Text>
                  ) : null}
                </View>
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
                    ) : null}
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
            {inputs.repeat !== 'never' ? (
              <View style={styles.repeatInfoContainer}>
                <REPEAT />

                <Text style={FONTS.body3}>
                  {inputs.repeat == 'daily'
                    ? 'Daily'
                    : inputs.repeat == 'weekly'
                    ? 'Weekly'
                    : inputs.repeat == 'fortnightly'
                    ? 'Every two weeks'
                    : inputs.repeat == 'monthly'
                    ? 'Monthly'
                    : null}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  singleDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  modalSingleDayDateContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  multiDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  dateAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 138,
  },
  repeatInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  textBubble: {
    // backgroundColor: COLOURS.paleGreen,
    paddingVertical: 3,
    borderRadius: 8,
  },

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

export default TimeOffRequest;
