import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  Platform,
} from 'react-native';
import Rota from './components/Rota';
import RotaPage from './screens/RotaPage';
import RequestTimeOff from './screens/RequestTimeOff';
import Day from './screens/Day';
import Home from './screens/Home';
import Finances from './screens/Finances';
import Profile from './screens/Profile';
import Login from './screens/Login';
import {
  useDimensions,
  useDeviceOrientation,
} from '@react-native-community/hooks';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const RotaStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RotaStackScreen = () => {
  return (
    <RotaStack.Navigator
      initialRouteName="Rota"
      screenOptions={{headerStyle: {backgroundColor: 'coral'}}}>
      <RotaStack.Screen name="Rota" component={RotaPage} />
      <RotaStack.Screen name="Request time off" component={RequestTimeOff} />
      <RotaStack.Screen
        name="Day"
        component={Day}
        options={({route}) => ({title: route.params.day})}
      />
    </RotaStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Rota" component={RotaStackScreen} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
