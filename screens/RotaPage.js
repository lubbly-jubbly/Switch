import React from 'react';
import {SafeAreaView} from 'react-native';
import {StyleSheet, Button, StatusBar} from 'react-native';
import Rota from '../components/Rota';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RotaPage = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Rota navigation={navigation} />
      <Button
        title="Request time off"
        onPress={() => navigation.navigate('Request time off')}
      />
      <Button title="Create Rota" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 2,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RotaPage;
