import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import BigButton from '../components/BigButton';
import Rota from '../components/Rota';

/* Rota tab first screen for employee. */
const RotaPage = ({navigation}) => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <Rota navigation={navigation} />
        <View style={styles.buttonContainer}>
          <BigButton
            title="Request time off"
            onPress={() => navigation.navigate('Request time off')}
          />
        </View>
      </View>
    </View>
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
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default RotaPage;
