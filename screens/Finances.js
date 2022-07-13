import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {createRota} from '../createRota';

const Finances = () => {
  React.useEffect(() => {
    // createRota(new Date('2022/08/29'), new Date('2022/09/04'));
  }, []);

  return <Text>Finances</Text>;
};

export default Finances;
