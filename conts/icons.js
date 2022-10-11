import React from 'react';
import {StyleSheet} from 'react-native';
import COLOURS from './colours';
import {APPSTYLES} from './theme';

import Entypo from 'react-native-vector-icons/Entypo';
import {
  default as AntDesign,
  default as FontAwesome,
} from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
Entypo.loadFont();
FontAwesome.loadFont();
AntDesign.loadFont();

export const CANCEL = () => {
  return <Entypo name={'cross'} style={[{fontSize: 30}, styles.cancelIcon]} />;
};

export const ADD = () => {
  return <Entypo name={'plus'} style={[{fontSize: 30}, styles.addIcon]} />;
};

export const NEXT = () => {
  return (
    <Entypo
      name={'chevron-right'}
      style={{fontSize: 30, color: COLOURS.blue}}
    />
  );
};

export const SMALLNEXT = () => {
  return (
    <Entypo
      name={'chevron-right'}
      style={[{fontSize: 20}, APPSTYLES.timeText]}
    />
  );
};

export const PREVIOUS = () => {
  return (
    <Entypo name={'chevron-left'} style={{fontSize: 30, color: COLOURS.blue}} />
  );
};

export const INFO = () => {
  return (
    <Ionicons
      name={'alert-circle-outline'}
      style={{fontSize: 22, color: COLOURS.white, marginRight: 5}}
    />
  );
};

export const PHONE = () => {
  return <Entypo name={'phone'} style={{fontSize: 20, color: COLOURS.grey}} />;
};

export const EMAIL = () => {
  return <Ionicons name={'mail'} style={{fontSize: 20, color: COLOURS.grey}} />;
};

export const STAFF = () => {
  return (
    <Ionicons
      name={'person'}
      style={[{fontSize: 20, marginHorizontal: 5}, styles.icon]}
    />
  );
};

export const CLOCK = () => {
  return (
    <Ionicons
      name={'time'}
      style={[{fontSize: 20, marginHorizontal: 5}, styles.icon]}
    />
  );
};

export const EDIT = () => {
  return (
    <Entypo
      name={'edit'}
      style={[{fontSize: 20, marginHorizontal: 5}, styles.orangeIcon]}
    />
  );
};

export const BIN = () => {
  return (
    <Ionicons
      name={'trash-outline'}
      style={[{fontSize: 25}, styles.orangeIcon]}
    />
  );
};

export const REPEAT = () => {
  return (
    <FontAwesome
      name={'repeat'}
      style={[{fontSize: 20, marginHorizontal: 8}, styles.requestsIcon]}
    />
  );
};

export const QUESTION = () => {
  return (
    <AntDesign
      name={'question'}
      style={[{fontSize: 25, marginHorizontal: 8}, styles.requestsIcon]}
    />
  );
};

export const BIGCLOCK = () => {
  return (
    <Ionicons
      name={'time'}
      style={[{fontSize: 22, marginHorizontal: 6}, styles.requestsIcon]}
    />
  );
};

export const CALENDAR = () => {
  return (
    <Entypo
      name={'calendar'}
      style={[{fontSize: 22, marginHorizontal: 6}, styles.requestsIcon]}
    />
  );
};

export const DOWNARROW = () => {
  return (
    <Entypo name={'flow-line'} style={[{fontSize: 35}, styles.requestsIcon]} />
  );
};

const styles = StyleSheet.create({
  icon: {
    color: COLOURS.grey,
  },
  requestsIcon: {
    color: COLOURS.grey,
  },
  blackIcon: {
    color: COLOURS.black,
  },
  orangeIcon: {
    color: COLOURS.blue,
  },
  cancelIcon: {
    color: COLOURS.red,
  },
  addIcon: {
    color: COLOURS.lightBlue,
  },
});
