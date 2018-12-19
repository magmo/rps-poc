import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';


import { scenarios } from '../../../../core';
import { itTransitionsToStateType } from './helpers';


const {
  asAddress,
  asPrivateKey,
  channelId,
  channelNonce,
  libraryAddress,
  participants,
  proposeHex,
  acceptHex,
} = scenarios.standard;

const {
  concludeHex,
} = scenarios.bResignsAfterOneRound;

const defaults = {
  address: asAddress,
  adjudicator: 'adj-address',
  channelId,
  channelNonce,
  libraryAddress,
  networkId: 3,
  participants,
  uid: 'uid',
};

const defaultsA = {
  ...defaults,
  ourIndex: 0,
  privateKey: asPrivateKey,
};

describe('start in ApproveConclude', () => {
  describe('action taken: conclude approved, first conclude state', () => {
    const state = states.approveConclude({
      ...defaultsA,
      penultimatePosition: { data: proposeHex, signature: 'sig' },
      lastPosition: { data: acceptHex, signature: 'sig' },
      turnNum: 1,
    });

    const action = actions.concludeApproved();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.WAIT_FOR_OPPONENT_CONCLUDE, updatedState);
  });

  describe('action taken: conclude approved, second conclude state', () => {
    const state = states.approveConclude({
      ...defaultsA,
      penultimatePosition: { data: proposeHex, signature: 'sig' },
      lastPosition: { data: concludeHex, signature: 'sig' },
      turnNum: 1,
    });

    const action = actions.concludeApproved();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.ACKNOWLEDGE_CONCLUDE_SUCCESS, updatedState);
  });

});