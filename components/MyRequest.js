import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import COLOURS from '../conts/colours';
import {BIGCLOCK, DOWNARROW, REPEAT, SMALLNEXT} from '../conts/icons';
import {APPSTYLES, FONTS, SIZES} from '../conts/theme';

/* Request component displayed in employee Requests tab */
const MyRequest = ({navigation, inputs}) => {
  return (
    <View style={APPSTYLES.itemContainer}>
      <Text style={FONTS.modalText}>{inputs.reason}</Text>

      <View style={styles.dateContainer}>
        <View>
          {isSameDay(parseISO(inputs.starts), parseISO(inputs.ends)) ? (
            <View style={[styles.singleDayDateContainer, styles.textBubble]}>
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
  );
};

const styles = StyleSheet.create({
  rowFlex: {
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
