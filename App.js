import React, {useState, useEffect} from 'react';
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
import ForgotPassword from './screens/ForgotPassword';
import EditTeam from './screens/EditTeam';
import HomeAdmin from './screens/HomeAdmin';
import ProfileAdmin from './screens/ProfileAdmin';
import {
  useDimensions,
  useDeviceOrientation,
} from '@react-native-community/hooks';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import auth from '@react-native-firebase/auth';
import EnterJoinCode from './screens/EnterJoinCode';
import CreateTeam from './screens/CreateTeam';
import {checkIfInTeam, userIsAdmin} from './apiService';
import {database} from './apiService';
import COLOURS from './conts/colours';
import ChooseShifts from './screens/ChooseShifts';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};
const RotaStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const RotaStackScreen = () => {
  return (
    <RotaStack.Navigator initialRouteName="Rota">
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
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState({
    isAdmin: '',
    team: '',
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    if (user) {
      setLoading(true);
      const userRef = database.ref('users/' + user.uid);

      userRef.once('value').then(snapshot => {
        setUserInfo({
          isAdmin: snapshot.val().isAdmin,
          team: snapshot.val().team,
        });
        setLoading(false);
      });
    } else {
      setUserInfo({});
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (user) {
      const userRef = database.ref('users/' + user.uid + '/team');
      const OnLoadingListener = userRef.on('value', snapshot => {
        setUserInfo({
          team: snapshot.val(),
        });
        console.log('listened!!');
      });

      return () => {
        userRef.off('value', OnLoadingListener);
        subscriber; // unsubscribe on unmount
      };
    }
  }, []);

  const HomeStackScreen = () => {
    if (userInfo.isAdmin) {
      return (
        <HomeStack.Navigator initialRouteName="Home">
          <HomeStack.Screen name="Home" component={HomeAdmin} />
          <HomeStack.Screen
            name="Request time off"
            component={RequestTimeOff}
          />
          <HomeStack.Screen
            name="Day"
            component={Day}
            options={({route}) => ({title: route.params.day})}
          />
        </HomeStack.Navigator>
      );
    } else {
      return (
        <HomeStack.Navigator initialRouteName="Home">
          <HomeStack.Screen name="Home" component={Home} />
          <HomeStack.Screen
            name="Request time off"
            component={RequestTimeOff}
          />
          <HomeStack.Screen
            name="Day"
            component={Day}
            options={({route}) => ({title: route.params.day})}
          />
        </HomeStack.Navigator>
      );
    }
  };

  const ProfileStackScreen = () => {
    if (userInfo.isAdmin) {
      return (
        <ProfileStack.Navigator initialRouteName="Profile">
          <ProfileStack.Screen name="Profile" component={ProfileAdmin} />
          <ProfileStack.Screen name="Edit Team" component={EditTeam} />
          <ProfileStack.Screen name="Choose Shifts" component={ChooseShifts} />
        </ProfileStack.Navigator>
      );
    } else {
      return (
        <ProfileStack.Navigator initialRouteName="Profile">
          <ProfileStack.Screen name="Profile" component={Profile} />
          {/* <ProfileStack.Screen name="Edit Team" component={EditTeam} /> */}
        </ProfileStack.Navigator>
      );
    }
  };

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          initialRouteName="Login"
          screenOptions={{headerStyle: {backgroundColor: 'coral'}}}>
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="Signup" component={Signup} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  } else if (userInfo.isAdmin && !userInfo.team) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          initialRouteName="CreateTeam"
          screenOptions={{headerStyle: {backgroundColor: 'coral'}}}>
          <AuthStack.Screen name="CreateTeam" component={CreateTeam} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  } else if (!userInfo.isAdmin && !userInfo.team) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          initialRouteName="EnterJoinCode"
          screenOptions={{headerStyle: {backgroundColor: 'coral'}}}>
          <AuthStack.Screen name="EnterJoinCode" component={EnterJoinCode} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Rota') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Finances') {
              iconName = focused ? 'cash' : 'cash-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLOURS.blue,
          tabBarInactiveTintColor: COLOURS.paleGreen,
          headerShown: false,
          tabBarShowLabel: false,
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Rota" component={RotaStackScreen} />
        <Tab.Screen name="Finances" component={Finances} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
