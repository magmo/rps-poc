import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';

import { itTransitionsToStateType, itSendsATransaction, itTransitionsToStage } from './helpers';
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


describe('when in APPROVE_CHALLENGE', () => {
    const state = states.approveChallenge({ ...defaults });

    describe('when a challenge is approved', () => {
        const action = actions.approveChallenge();
        const updatedState = walletReducer(state, action);
        itTransitionsToStateType(states.INITIATE_CHALLENGE, updatedState);
        itSendsATransaction(updatedState);
    });

    describe('when a challenge is declined', () => {
        const action = actions.declineChallenge();
        const updatedState = walletReducer(state, action);
        itTransitionsToStage(states.RUNNING, updatedState);
    });
});

describe('when in INITIATE_CHALLENGE', () => {
    const state = states.initiateChallenge({ ...defaults });

    describe('when a challenge is initiated', () => {
        const action = actions.challengeInitiated();
        const updatedState = walletReducer(state, action);

        itSendsATransaction(updatedState);
        itTransitionsToStateType(states.WAIT_FOR_CHALLENGE_CONFIRMATION, updatedState);
    });
});

describe('when in WAIT_FOR_CHALLENGE_CONFIRMATION', () => {
    const state = states.waitForChallengeConfirmation({ ...defaults });

    describe('when a challenge is confirmed', () => {
        const action = actions.challengeConfirmed();
        const updatedState = walletReducer(state, action);

        itTransitionsToStateType(states.WAIT_FOR_RESPONSE_OR_TIMEOUT, updatedState);
    });
});


describe('when in WAIT_FOR_RESPONSE_OR_TIMEOUT', () => {
    const state = states.waitForResponseOrTimeout({ ...defaults });

    describe('when the opponent responds', () => {
        const action = actions.challengeResponseReceived('0xC1');
        const updatedState = walletReducer(state, action);

        itTransitionsToStateType(states.ACKNOWLEDGE_CHALLENGE_RESPONSE, updatedState);
    });

    describe('when the challenge times out', () => {
        const action = actions.challengeTimeout();
        const updatedState = walletReducer(state, action);

        itTransitionsToStateType(states.ACKNOWLEDGE_CHALLENGE_TIMEOUT, updatedState);
    });
});

describe('when in ACKNOWLEDGE_RESPONSE', () => {
    const state = states.acknowledgeChallengeResponse({ ...defaults });
    const action = actions.acknowledgeChallengeResponse();
    const updatedState = walletReducer(state, action);

    itTransitionsToStage(states.RUNNING, updatedState);

});

describe('when in ACKNOWLEDGE_TIMEOUT', () => {
    const state = states.acknowledgeChallengeTimeout({ ...defaults });
    const action = actions.acknowledgeChallengeTimeout();
    const updatedState = walletReducer(state, action);

    itTransitionsToStage(states.RUNNING, updatedState);

});