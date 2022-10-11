import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import BigButton from '../components/BigButton';
import DatePicker from '../components/DatePicker';
import Rota from '../components/Rota';
import {SmallButton} from '../components/SmallButton';
import COLOURS from '../conts/colours';
import {CANCEL} from '../conts/icons';
import {APPSTYLES, FONTS} from '../conts/theme';
import {createRota} from '../createRota';

/* Rota tab first screen for admin.  */
const RotaPageAdmin = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputs, setInputs] = useState({
    starts: '',
    ends: '',
  });

  /* Called when user presses create rota button in modal. Generates rota. */
  async function handleSubmit() {
    createRota(parseISO(inputs.starts), parseISO(inputs.ends));
    setModalVisible(!modalVisible);
  }

  /* Receives date picker input */
  const startDateToParent = date => {
    handleOnchange(date, 'starts');
  };

  /* Receives date picker input */
  const endDateToParent = date => {
    handleOnchange(date, 'ends');
  };

  /* Called when user edits a field. Adds input to inputs state variable. */
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
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

              <Text
                style={[
                  FONTS.modalText,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Create Rota?
              </Text>
              <Text
                style={[
                  FONTS.modalSubHeadingText,
                  {textAlign: 'center', marginTop: 8},
                ]}>
                If a rota is already in place on these dates, the rota may be
                changed.
              </Text>
              <View style={styles.datePickers}>
                <DatePicker
                  label="From..."
                  timeRequired={false}
                  dateToParent={startDateToParent}
                />
                <DatePicker
                  label="To..."
                  timeRequired={false}
                  dateToParent={endDateToParent}
                />
              </View>
            </View>

            <SmallButton onPress={() => handleSubmit()} title="Create Rota" />
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Rota navigation={navigation} />
        <View style={styles.buttonContainer}>
          <BigButton
            title="Mark time off"
            onPress={() => navigation.navigate('Select time off')}
          />
          <BigButton
            title="Create Rota"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  container: {},
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLOURS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLOURS.paleGreen,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 50,
  },
  button: {
    marginVertical: 15,
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
  datePickers: {
    marginTop: 20,
  },
});

export default RotaPageAdmin;
