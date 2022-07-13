import React from 'react';
import COLOURS from './colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Entypo from 'react-native-vector-icons/Entypo';
Entypo.loadFont();

export const CANCEL = () => {
  return (
    <Entypo name={'cross'} style={{fontSize: 30, color: COLOURS.purple}} />
  );
};

export const ADD = () => {
  return <Entypo name={'plus'} style={{fontSize: 30, color: COLOURS.purple}} />;
};

export const NEXT = () => {
  return (
    <Entypo
      name={'chevron-right'}
      style={{fontSize: 30, color: COLOURS.purple}}
    />
  );
};
export const PREVIOUS = () => {
  return (
    <Entypo
      name={'chevron-left'}
      style={{fontSize: 30, color: COLOURS.purple}}
    />
  );
};

export const PHONE = () => {
  return <Entypo name={'phone'} style={{fontSize: 20, color: COLOURS.grey}} />;
};

export const EMAIL = () => {
  return <Entypo name={'mail'} style={{fontSize: 20, color: COLOURS.grey}} />;
};
