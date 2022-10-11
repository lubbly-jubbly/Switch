import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';
import React, {useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {changeRequestStatus, database} from '../apiService';
import COLOURS from '../conts/colours';
import {
  BIGCLOCK,
  CALENDAR,
  CANCEL,
  DOWNARROW,
  NEXT,
  QUESTION,
  REPEAT,
  SMALLNEXT,
} from '../conts/icons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';
import {SmallButton} from './SmallButton';
import {SmallCancelButton} from './SmallCancelButton';
import UserName from './UserName';

// Time off request component displayed in Admin Requests tab.
const TimeOffRequest = ({navigation, inputs}) => {
  const [senderName, setSenderName] = useState();
  const [senderAbbrevName, setSenderAbbrevName] = useState();
  const [senderColour, setSenderColour] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  // Called if admin presses reject button
  const handleRejectRequest = () => {
    changeRequestStatus('rejected', inputs.Id);
    setModalVisible(!modalVisible);
  };

  // Called if admin presses accept button
  const handleAcceptRequest = () => {
    changeRequestStatus('accepted', inputs.Id);
    setModalVisible(!modalVisible);
  };

  // Finding employee colour and name for the UserName component
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
      {/* Modal displaying request details and accept/reject buttons. Opened when user clicks on request. */}
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
              <View style={styles.modalContent}>
                <View style={{alignSelf: 'flex-start'}}>
                  <UserName name={senderName} colour={senderColour} />
                </View>
                <View style={[styles.rowFlex, styles.modalItem]}>
                  <QUESTION />
                  <Text style={FONTS.body3}>{inputs.reason}</Text>
                </View>
                {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
                  <View>
                    <View style={[styles.rowFlex, styles.modalItem]}>
                      <CALENDAR />
                      <Text style={FONTS.body3}>
                        {format(parseISO(inputs.starts), 'eeee d MMM')}
                        {'  '}
                      </Text>
                    </View>
                    <View style={[styles.rowFlex, styles.modalItem]}>
                      <BIGCLOCK />
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[FONTS.body3]}>
                          {format(parseISO(inputs.starts), 'p')}
                        </Text>
                        <SMALLNEXT />
                        {!inputs.isAllDay ? (
                          <Text style={FONTS.body3}>
                            {format(parseISO(inputs.ends), 'p')}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View
                    style={[styles.multiDayDateContainer, styles.modalItem]}>
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
                  <View style={[styles.repeatInfoContainer, styles.modalItem]}>
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

                {inputs.notes ? (
                  <View style={[styles.repeatInfoContainer, styles.modalItem]}>
                    {inputs.notes}
                  </View>
                ) : null}
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <SmallCancelButton
                  title="Reject"
                  onPress={() => handleRejectRequest()}
                />
                <SmallButton
                  title="Accept"
                  onPress={() => handleAcceptRequest()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={APPSTYLES.itemContainer}
        onPress={() => setModalVisible(true)}>
        <View style={[styles.rowFlex, {justifyContent: 'space-between'}]}>
          <View>
            <View style={styles.userNameContainer}>
              <UserName name={senderAbbrevName} colour={senderColour} />
              <Text style={FONTS.body3}>{inputs.reason}</Text>
            </View>
            <View style={styles.dateContainer}>
              <View>
                {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
                  <View
                    style={[styles.singleDayDateContainer, styles.textBubble]}>
                    <BIGCLOCK />
                    <Text style={FONTS.body3}>
                      {format(parseISO(inputs.starts), 'eee d MMM')}
                      {'  '}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[APPSTYLES.timeText, FONTS.body3]}>
                        {format(parseISO(inputs.starts), 'p')}
                      </Text>
                      <SMALLNEXT />
                      {!inputs.isAllDay ? (
                        <Text style={[APPSTYLES.timeText, FONTS.body3]}>
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
          </View>
          <View>
            <NEXT />
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
  },
  singleDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 0,
  },
  modalSingleDayDateContainer: {
    flexDirection: 'column',
    paddingVertical: 0,
  },
  multiDayDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
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
    paddingVertical: 0,
  },
  textBubble: {
    paddingVertical: 4,
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
    flex: 1,
  },
  dateContainer: {
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
  modalContent: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalItem: {
    marginTop: 15,
  },
});

export default TimeOffRequest;
