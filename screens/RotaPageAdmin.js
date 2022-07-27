import React, {useState} from 'react';
import {Modal, Pressable, SafeAreaView} from 'react-native';
import {StyleSheet, Button, StatusBar, View, Text} from 'react-native';
import Rota from '../components/Rota';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BigButton from '../components/BigButton';
import COLOURS from '../conts/colours';
import {APPSTYLES, FONTS} from '../conts/theme';
import {CANCEL} from '../conts/icons';
import DatePicker from '../components/DatePicker';
import {SmallButton} from '../components/SmallButton';
import {createRota} from '../createRota';
import {parseISO} from 'date-fns';

const RotaPageAdmin = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputs, setInputs] = useState({
    starts: '',
    ends: '',
  });

  async function handleSubmit() {
    createRota(parseISO(inputs.starts), parseISO(inputs.ends));
    setModalVisible(!modalVisible);
  }

  const startDateToParent = date => {
    handleOnchange(date, 'starts');
  };
  const endDateToParent = date => {
    handleOnchange(date, 'ends');
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
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
      <Rota navigation={navigation} />
      <BigButton
        title="Mark time off"
        onPress={() => navigation.navigate('Select time off')}
      />
      <BigButton
        title="Create Rota"
        onPress={() => setModalVisible(!modalVisible)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 2,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
    // borderColor: COLOURS.paleGreen,
    // borderWidth: 3,

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
