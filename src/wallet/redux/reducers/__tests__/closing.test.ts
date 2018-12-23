import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';
import * as outgoing from '../../../interface/outgoing';

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

const aResignsAfterOneRound = scenarios.aResignsAfterOneRound;
const bResignsAfterOneRound = scenarios.bResignsAfterOneRound;

const defaults = {
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
  address: asAddress,
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
      lastPosition: { data: bResignsAfterOneRound.concludeHex, signature: 'sig' },
      turnNum: 1,
    });

    const action = actions.concludeApproved();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.ACKNOWLEDGE_CONCLUDE_SUCCESS, updatedState);
    expect((updatedState.messageOutbox!).type).toEqual(outgoing.SEND_MESSAGE);
  });

});

describe('start in WaitForOpponentConclude', () => {
  describe('action taken: messageReceived', () => {
    const state = states.waitForOpponentConclude({
      ...defaultsA,
      penultimatePosition: { data: aResignsAfterOneRound.restingHex, signature: 'sig' },
      lastPosition: { data: aResignsAfterOneRound.concludeHex, signature: 'sig' },
      turnNum: 8,
    });

    const action = actions.messageReceived(aResignsAfterOneRound.conclude2Hex, aResignsAfterOneRound.conclude2Sig);
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.ACKNOWLEDGE_CONCLUDE_SUCCESS, updatedState);
  });
});

describe('start in AcknowledgConcludeSuccess', () => {
  describe('action taken: conclude success acknowledged', () => {
    const state = states.acknowledgeConcludeSuccess({
      ...defaultsA,
      penultimatePosition: { data: aResignsAfterOneRound.concludeHex, signature: 'sig' },
      lastPosition: { data: aResignsAfterOneRound.conclude2Hex, signature: 'sig' },
      turnNum: 9,
    });

    const action = actions.concludeSuccessAcknowledged();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.APPROVE_WITHDRAWAL, updatedState);
  });

  describe('action taken: conclude success acknowledged', () => {
    const state = states.acknowledgeConcludeSuccess({
      ...defaultsA,
      penultimatePosition: { data: aResignsAfterOneRound.concludeHex, signature: 'sig' },
      lastPosition: { data: aResignsAfterOneRound.conclude2Hex, signature: 'sig' },
      turnNum: 9,
      adjudicator: undefined,
    });

    const action = actions.concludeSuccessAcknowledged();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.ACKNOWLEDGE_CLOSE_SUCCESS, updatedState);
  });

});

describe('start in AcknowledgCloseSuccess', () => {
  describe('action taken: close success acknowledged', () => {
    const state = states.acknowledgeCloseSuccess({
      ...defaultsA,
      penultimatePosition: { data: aResignsAfterOneRound.concludeHex, signature: 'sig' },
      lastPosition: { data: aResignsAfterOneRound.conclude2Hex, signature: 'sig' },
      turnNum: 9,
    });

    const action = actions.closeSuccessAcknowledged();
    const updatedState = walletReducer(state, action);
    itTransitionsToStateType(states.WAIT_FOR_CHANNEL, updatedState);
    expect((updatedState.messageOutbox!).type).toEqual(outgoing.CLOSE_SUCCESS);
  });
});