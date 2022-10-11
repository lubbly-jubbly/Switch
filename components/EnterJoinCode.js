import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Icon from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {SmallButton} from './SmallButton';
import COLOURS from '../conts/colours';
import {APPSTYLES, FONTS, MODALSTYLES} from '../conts/theme';
Icon.loadFont();
const CELL_COUNT = 6;

/* Join code field component used in Create Team screen. */
const EnterJoinCode = ({childToParent, error}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [modalVisible, setModalVisible] = useState(null);

  return (
    <View>
      {/* Help modal providing information on join code's location. */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(null);
        }}>
        <View style={MODALSTYLES.centeredView}>
          <View style={MODALSTYLES.modalView}>
            <View style={[APPSTYLES.modal, {flexDirection: 'column'}]}>
              <Pressable
                onPress={() => {
                  setModalVisible(null);
                  setHours(null);
                }}
                style={{alignSelf: 'flex-end'}}></Pressable>
              <Text
                style={[
                  FONTS.modalText,
                  {textAlign: 'center', marginBottom: 15},
                ]}>
                Ask your manager for your team's join code. They can find it in
                the Profile section of their app.
              </Text>
            </View>

            <SmallButton
              onPress={() => setModalVisible(!modalVisible)}
              title="OK   "
            />
          </View>
        </View>
      </Modal>
      <View style={styles.root}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={APPSTYLES.inputLabel}>Enter your team's join code.</Text>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Icon
              name={'help-outline'}
              style={{
                color: COLOURS.blue,
                fontSize: 22,
                marginRight: 10,
              }}
            />
          </Pressable>
        </View>
        <View style={styles.fieldRow}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={code => {
              setValue(code);
              childToParent(code);
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  isFocused && styles.focusCell,
                  {borderWidth: error ? 2 : 0},
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 15, color: COLOURS.grey},
  cell: {
    borderColor: COLOURS.red,
    width: 45,
    height: 45,
    lineHeight: 55,
    fontSize: 30,
    fontWeight: '300',
    textAlign: 'center',
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: COLOURS.light,
  },
  focusCell: {
    borderColor: '#000',
  },
  fieldRow: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: 0,
  },
});

export default EnterJoinCode;
