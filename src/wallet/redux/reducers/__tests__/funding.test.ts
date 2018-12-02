import { walletReducer } from '..';

import * as states from '../../../states';
import * as actions from '../../actions';


import { scenarios } from '../../../../core';
import { itTransitionsToStateType } from './helpers';


const {
  asAddress,
  asPrivateKey,
  bsPrivateKey,
  channelId,
  channelNonce,
  libraryAddress,
  participants,
  preFundSetupAHex,
  preFundSetupBHex,
  postFundSetupAHex,
  postFundSetupBHex,
  postFundSetupASig,
  postFundSetupBSig,
} = scenarios.standard;

const defaults = {
  address: asAddress,
  adjudicator: 'adj-address',
  channelId,
  channelNonce,
  libraryAddress,
  networkId: 123,
  participants,
  uid: 'uid',
};

const defaultsA = {
  ...defaults,
  ourIndex: 0,
  privateKey: asPrivateKey,
};

const defaultsB = {
  ...defaults,
  ourIndex: 1,
  privateKey: bsPrivateKey,
};

const justReceivedPreFundSetupB = {
  penultimatePosition: { data: preFundSetupAHex, signature: 'fake-sig' },
  lastPosition: { data: preFundSetupBHex, signature: 'fake-sig' },
  turnNum: 1,
};

const justReceivedPostFundSetupA = {
  penultimatePosition: { data: preFundSetupBHex, signature: 'fake-sig' },
  lastPosition: { data: postFundSetupAHex, signature: 'fake-sig' },
  turnNum: 2,
};

const justReceivedPostFundSetupB = {
  penultimatePosition: { data: postFundSetupAHex, signature: 'fake-sig' },
  lastPosition: { data: postFundSetupBHex, signature: 'fake-sig' },
  turnNum: 3,
};


describe('start in WaitForFundingRequest', () => {
  describe('action taken: funding requested', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.waitForFundingRequest(testDefaults);
    const action = actions.fundingRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_FUNDING, updatedState);
  });

  describe('action taken: funding requested', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.waitForFundingRequest(testDefaults);
    const action = actions.fundingRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_FUNDING, updatedState);
  });

});

describe('start in ApproveFunding', () => {
  describe('incoming action: funding approved', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.approveFunding(testDefaults);
    const action = actions.fundingApproved();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_DEPLOY_TO_BE_SENT_TO_METAMASK, updatedState);
  });

  describe('action taken: funding approved', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.approveFunding(testDefaults);
    const action = actions.fundingApproved();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_WAIT_FOR_DEPLOY_ADDRESS, updatedState);
  });

});

describe('start in aWaitForDeployToBeSentToMetaMask', () => {
  describe('incoming action: deploySentToMetaMask', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.aWaitForDeployToBeSentToMetaMask(testDefaults);
    const action = actions.deploySentToMetaMask();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_SUBMIT_DEPLOY_IN_METAMASK, updatedState);
  });
});

describe('start in aSubmitDeployInMetaMask', () => {
  describe('incoming action: deploy submitted', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.aSubmitDeployInMetaMask(testDefaults);
    const action = actions.deploySubmittedInMetaMask(defaults.adjudicator);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPLOY_CONFIRMATION, updatedState);
  });
});


describe('start in BWaitForDeployAddress', () => {
  describe('incoming action: deploy initiated', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.bWaitForDeployAddress(testDefaults);
    const action = actions.deployAddressReceived(defaults.adjudicator);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPLOY_CONFIRMATION, updatedState);
  });
});

describe('start in WaitForDeployConfirmation', () => {
  describe('incoming action: deploy confirmed', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.waitForDeployConfirmation(testDefaults);
    const action = actions.deployConfirmed();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_DEPOSIT_INITIATION, updatedState);
  });

  describe('incoming action: deploy confirmed', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.waitForDeployConfirmation(testDefaults);
    const action = actions.deployConfirmed();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_INITIATE_DEPOSIT, updatedState);
  });
});

describe('start in AWaitForDepositInitiation', () => {
  describe('incoming action: deposit initiated', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.aWaitForDepositInitiation(testDefaults);
    const action = actions.depositInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPOSIT_CONFIRMATION, updatedState);
  });
});

describe('start in BInitiateDeposti', () => {
  describe('incoming action: deposit initiated', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.bInitiateDeposit(testDefaults);
    const action = actions.depositInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPOSIT_CONFIRMATION, updatedState);
  });
});

describe('start in WaitForDepositConfirmation', () => {
  describe('incoming action: deposit confirmed', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPreFundSetupB };
    const state = states.waitForDepositConfirmation(testDefaults);
    const action = actions.depositConfirmed();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_POST_FUND_SETUP, updatedState);
  });

  describe('incoming action: deposit confirmed', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.waitForDepositConfirmation(testDefaults);
    const action = actions.depositConfirmed();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_WAIT_FOR_POST_FUND_SETUP, updatedState);
  });
});

describe('start in AWaitForPostFundSetup', () => {
  describe('incoming action: B post fund setup', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPostFundSetupA };
    const state = states.aWaitForPostFundSetup(testDefaults);
    const action = actions.postFundSetupReceived(postFundSetupBHex, postFundSetupBSig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_FUNDING_SUCCESS, updatedState);
  });
});

describe('start in BWaitForPostFundSetup', () => {
  describe('incoming action: A post fund setup', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPreFundSetupB };
    const state = states.bWaitForPostFundSetup(testDefaults);
    const action = actions.postFundSetupReceived(postFundSetupAHex, postFundSetupASig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_FUNDING_SUCCESS, updatedState);
  });
});

describe('start in AcknowledgeFundingSuccess', () => {
  describe('incoming action: FundingSuccessAcknowledged', () => { // player A scenario
    const testDefaults = { ...defaultsA, ...justReceivedPostFundSetupB };
    const state = states.acknowledgeFundingSuccess(testDefaults);
    const action = actions.fundingSuccessAcknowledged();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
  });

  describe('incoming action: FundingSuccessAcknowledged', () => { // player B scenario
    const testDefaults = { ...defaultsB, ...justReceivedPostFundSetupB };
    const state = states.acknowledgeFundingSuccess(testDefaults);
    const action = actions.fundingSuccessAcknowledged();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
  });
});