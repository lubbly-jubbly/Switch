import React from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Home = () => {
  return (
    <View>
      <Text>
        <AntDesign
          name="customerservice"
          style={{color: 'red', fontSize: 50}}
        />
      </Text>
    </View>
  );
};

export default Home;
