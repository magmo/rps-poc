import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';

import { itTransitionsToStateType, itDoesntTransition, itIncreasesTurnNumBy } from './helpers';
import { scenarios } from '../../../../core';

const {
  asAddress,
  asPrivateKey,
  bsAddress,
  bsPrivateKey,
  revealHex,
  acceptHex,
  acceptSig,
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
  challengeExpiry: new Date(),
};

const bParams = { address: bsAddress, ourIndex: 1, privateKey: bsPrivateKey };
const aParams = { address: asAddress, ourIndex: 0, privateKey: asPrivateKey };

const { restingHex, restingSig } = scenarios.aResignsAfterOneRound;
const { concludeHex, concludeSig } = scenarios.bResignsAfterOneRound;

describe('when in WaitForUpdate on our turn', () => {
  // after the reveal it is B's turn. So we must be B here
  const bDefaults = { ...defaults, ...bParams };
  const state = states.waitForUpdate(bDefaults);

  describe('when we send in a new position', () => {
    const action = actions.ownPositionReceived(restingHex);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
    itIncreasesTurnNumBy(1, state, updatedState);
  });

  describe('when we send in a position with the wrong turnNum', () => {
    const action = actions.ownPositionReceived(acceptHex);
    const updatedState = walletReducer(state, action);

    itDoesntTransition(state, updatedState);
  });

  describe('when an opponent sends a new position', () => {
    const action = actions.opponentPositionReceived(restingHex, restingSig);
    const updatedState = walletReducer(state, action);

    itDoesntTransition(state, updatedState); // because it's our turn
  });

  describe('when we send in a conclude state', () => {
    const action = actions.ownPositionReceived(concludeHex);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.CONCLUDING, updatedState);
    itIncreasesTurnNumBy(1, state, updatedState);
  });

  describe('when the wallet detects an opponent challenge', () => {
    const action = actions.opponentChallengeDetected(defaults.challengeExpiry);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_CHALLENGE, updatedState);
    itIncreasesTurnNumBy(0, state, updatedState);
  });

  describe('when we request to launch a challenge', () => {
    const action = actions.challengeRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_CHALLENGE, updatedState);
    itIncreasesTurnNumBy(0, state, updatedState);
  });
});

describe(`when in WaitForUpdate on our opponent's turn`, () => {
  // after the reveal it is B's turn. So we must be A here
  const aDefaults = { ...defaults, ...aParams };
  const state = states.waitForUpdate(aDefaults);

  describe('when we send in a new position', () => {
    const action = actions.ownPositionReceived(restingHex);
    const updatedState = walletReducer(state, action);
    // it ignores it
    itDoesntTransition(state, updatedState);
  });

  describe('when an opponent sends a new position', () => {
    const action = actions.opponentPositionReceived(restingHex, restingSig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
    itIncreasesTurnNumBy(1, state, updatedState);
  });

  describe('when an opponent sends a new position with the wrong turnNum', () => {
    const action = actions.opponentPositionReceived(acceptHex, acceptSig);
    const updatedState = walletReducer(state, action);

    itDoesntTransition(state, updatedState);
  });

  describe('when an opponent sends a new position with the wrong signature', () => {
    const action = actions.opponentPositionReceived(restingHex, 'not-a-signature');
    const updatedState = walletReducer(state, action);

    itDoesntTransition(state, updatedState);
  });

  describe('when our opponent sends in a conclude state', () => {
    const action = actions.opponentPositionReceived(concludeHex, concludeSig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.CONCLUDING, updatedState);
    itIncreasesTurnNumBy(1, state, updatedState);
  });

  describe('when the wallet detects an opponent challenge', () => {
    const action = actions.opponentChallengeDetected(defaults.challengeExpiry);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_CHALLENGE, updatedState);
    itIncreasesTurnNumBy(0, state, updatedState);
  });

  describe('when we request to launch a challenge', () => {
    const action = actions.challengeRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_CHALLENGE, updatedState);
    itIncreasesTurnNumBy(0, state, updatedState);
  });
});
