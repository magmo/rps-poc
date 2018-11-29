import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';

import { itTransitionsToStateType } from './helpers';
import { scenarios } from '../../../../core';

const {
  asPrivateKey,
  revealHex,
  acceptHex,
  participants,
  channelId,
  channelNonce,
  libraryAddress,
} = scenarios.standard;

const defaults = {
  uid: 'uid',
  participants,
  libraryAddress,
  channelId,
  channelNonce,
  lastPosition: revealHex,
  penultimatePosition: acceptHex,
  turnNum: 6,
  adjudicator: 'adj-address',
  ourIndex: 0,
  address: 'address',
  privateKey: asPrivateKey,
};


describe('when in ApproveWithdrawal', () => {
  const state = states.approveWithdrawal(defaults);

  describe('and the user approves the withdrawal', () => {
    const destinationAddress = '0x123';
    const action = actions.withdrawalApproved(destinationAddress);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.INITIATE_WITHDRAWAL, updatedState);

    it.skip('puts the withdrawal transaction in the outbox', () => {
      expect(updatedState.transactionOutbox).toBe(expect.anything());
      // todo
    });
  });

  describe('and the user rejects the withdrawal', () => {
    const action = actions.withdrawalRejected();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.CLOSED, updatedState);
  });
});

describe('when in InitiateWithdrawal', () => {
  const state = states.initiateWithdrawal(defaults);

  describe('and the transaction is submitted', () => {
    const action = actions.transactionSubmitted();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_WITHDRAWAL_CONFIRMATION, updatedState);
  });
});

describe('when in WaitForWithdrawalConfirmation', () => {
  const state = states.waitForWithdrawalConfirmation(defaults);

  describe('and the transaction is confirmed', () => {
    const action = actions.transactionConfirmed();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_WITHDRAWAL_SUCCESS, updatedState);
  });
});

describe('when in AcknowledgeWithdrawalSuccess', () => {
  const state = states.acknowledgeWithdrawalSuccess(defaults);

  describe('and the user acknowledges the withdrawal', () => {
    const action = actions.withdrawalSuccessAcknowledged();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_CHANNEL, updatedState);
  });
});
