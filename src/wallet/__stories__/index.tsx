import React from 'react';
import { storiesOf } from '@storybook/react';
import Wallet from '../containers/Wallet';
import { Provider } from 'react-redux';
import { approveFunding } from '../states';

import { scenarios } from '../../core';


const {
  asAddress,
  channelId,
  asPrivateKey,
  preFundSetupAHex,
  preFundSetupBHex,
  channelNonce,
  libraryAddress,
  participants,
} = scenarios.standard;

const defaults = {
  address: asAddress,
  adjudicator: 'adj-address',
  channelId,
  channelNonce,
  libraryAddress,
  participants,
  privateKey: asPrivateKey,
  uid: 'uid',
  ourIndex: 0,
  penultimatePosition: preFundSetupAHex,
  lastPosition: preFundSetupBHex,
  turnNum: 1,
};

const state = approveFunding(defaults); 

const store = {
  dispatch: action => {
    alert(`Action ${action.type} triggered`);
    return action;
  },
  getState: () => ({ wallet: state }), 
  subscribe: () => (() => {/* empty */ }),
  replaceReducer: () => { /* empty */ },
};

storiesOf('Button', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('test', () => <Wallet />);
