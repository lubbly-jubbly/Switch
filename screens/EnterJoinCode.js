import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Dialog, Portal, Paragraph} from 'react-native-paper';
import BigButton from '../components/BigButton';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import {handleSignOut} from '../authService';
import {joinTeamWithJoinCode} from '../apiService';
import COLOURS from '../conts/colours';
import {APPSTYLES} from '../conts/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
Icon.loadFont();
const CELL_COUNT = 6;

const EnterJoinCode = ({childToParent, error}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // const [visible, setVisible] = React.useState(false);

  // const changeDialog = () => setVisible(!visible);

  const user = auth().currentUser;

  // const handleCodeSubmit = () => {
  //   joinTeamWithJoinCode(user.uid, value);
  // };

  return (
    <View>
      {/* <Portal>
        <Dialog visible={visible} onDismiss={changeDialog}>
          <Dialog.Content>
            <Paragraph>heyyyy</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal> */}
      <View style={styles.root}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={APPSTYLES.inputLabel}>Enter your team's join code.</Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Your team's admin can find this information in .....",
              )
            }>
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
          {/* <View style={APPSTYLES.itemContainer}> */}
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={code => {
              setValue(code);
              childToParent(code);
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
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
  // root: {padding: 20},
  title: {fontSize: 15, color: COLOURS.grey},
  // codeFieldRoot: {marginTop: 20},
  cell: {
    // width: 40,
    // height: 40,
    // lineHeight: 38,
    // fontSize: 24,
    // borderWidth: 2,
    // borderColor: '#00000030',
    // textAlign: 'center',
    // backgroundColor: COLOURS.light,
    // borderRadius: 15,

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
