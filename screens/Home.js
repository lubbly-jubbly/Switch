import React from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOURS from '../conts/colours';

const Home = () => {
  return (
    <View>
      <Text>Welcome back, Libby!</Text>
      <Text>Your shifts this week:</Text>
      <Icon
        name="email-outline"
        style={{color: COLOURS.darkBlue, fontSize: 22, marginRight: 10}}
      />
    </View>
  );
};

export default Home;
