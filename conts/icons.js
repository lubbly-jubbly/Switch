import React from 'react';
import COLOURS from './colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Entypo from 'react-native-vector-icons/Entypo';
Entypo.loadFont();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont();

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
      style={{fontSize: 30, color: COLOURS.blue}}
    />
  );
};

export const SMALLNEXT = () => {
  return (
    <Entypo
      name={'chevron-right'}
      style={{fontSize: 20, color: COLOURS.blue}}
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
      style={{fontSize: 20, color: COLOURS.grey, marginHorizontal: 5}}
    />
  );
};

export const CLOCK = () => {
  return (
    <Ionicons
      name={'time'}
      style={{fontSize: 20, color: COLOURS.grey, marginHorizontal: 5}}
    />
  );
};

export const EDIT = () => {
  return (
    <Entypo
      name={'edit'}
      style={{fontSize: 20, color: COLOURS.purple, marginHorizontal: 5}}
    />
  );
};

export const BIN = () => {
  return (
    <Ionicons
      name={'trash-outline'}
      style={{fontSize: 25, color: COLOURS.purple}}
    />
  );
};

export const REPEAT = () => {
  return (
    <FontAwesome
      name={'repeat'}
      style={{fontSize: 20, color: COLOURS.purple, marginHorizontal: 8}}
    />
  );
};

export const BIGCLOCK = () => {
  return (
    <Ionicons
      name={'time'}
      style={{fontSize: 22, color: COLOURS.purple, marginHorizontal: 6}}
    />
  );
};

export const CALENDAR = () => {
  return (
    <Entypo
      name={'calendar'}
      style={{fontSize: 22, color: COLOURS.purple, marginHorizontal: 6}}
    />
  );
};

export const DOWNARROW = () => {
  return (
    <Entypo name={'flow-line'} style={{fontSize: 35, color: COLOURS.purple}} />
  );
};
