import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOURS from '../conts/colours';
import Shift from '../components/Shift';

const Home = ({navigation}) => {
  return (
    <View style={{backgroundColor: COLOURS.white, flex: 1}}>
      <Text>Welcome back, libby!</Text>
      <Text>Your shifts this week:</Text>
      <View style={styles.shiftContainer}>
        <Shift navigation={navigation} day={new Date()} />
        <Shift navigation={navigation} day={new Date()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {
    marginHorizontal: 20,
  },
});

export default Home;
