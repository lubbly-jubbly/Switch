import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
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
import Signup from './screens/Signup';

import {
  useDimensions,
  useDeviceOrientation,
} from '@react-native-community/hooks';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RotaStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

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
  const [isSignedIn, setIsSignedIn] = useState(false);
  return isSignedIn ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-outline' : 'home-outline';
            } else if (route.name === 'Rota') {
              iconName = focused ? 'calendar-outline' : 'calendar-outline';
            } else if (route.name === 'Finances') {
              iconName = focused ? 'cash-outline' : 'cash-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-outline' : 'person-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Rota" component={RotaStackScreen} />
        <Tab.Screen name="Finances" component={Signup} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <AuthStack.Navigator
        initialRouteName="Login"
        screenOptions={{headerStyle: {backgroundColor: 'coral'}}}>
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Signup" component={Signup} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
