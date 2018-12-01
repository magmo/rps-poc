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

const defaultsPrefund = {
  penultimatePosition: preFundSetupAHex,
  lastPosition: preFundSetupBHex,
  turnNum: 1,
};

const defaultsPrefundA = {
  ...defaultsA,
  ...defaultsPrefund,
};

const defaultsPrefundB = {
  ...defaultsB,
  ...defaultsPrefund,
};


describe('start in WaitForFundingRequest', () => {
  describe('action taken: funding requested', () => { // player A scenario
    const state = states.waitForFundingRequest(defaultsPrefundA);
    const action = actions.fundingRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_FUNDING, updatedState);
  });

  describe('action taken: funding requested', () => { // player B scenario
    const state = states.waitForFundingRequest(defaultsPrefundB);
    const action = actions.fundingRequested();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.APPROVE_FUNDING, updatedState);
  });

});

describe('start in ApproveFunding', () => {
  describe('incoming action: funding approved', () => { // player A scenario
    const state = states.approveFunding(defaultsPrefundA);
    const action = actions.fundingApproved();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_INITIATE_DEPLOY, updatedState);
  });

  describe('action taken: funding approved', () => { // player B scenario
    const testDefaults = {
      ...defaultsB,
      penultimatePosition: preFundSetupAHex,
      lastPosition: preFundSetupBHex,
      turnNum: 1,
    };
    const state = states.approveFunding(testDefaults);
    const action = actions.fundingApproved();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_WAIT_FOR_DEPLOY_INITIATION, updatedState);
  });

});

describe('start in AInitiateDeploy', () => {
  describe('incoming action: deploy initiated', () => { // player A scenario
    const state = states.aInitiateDeploy(defaultsPrefundA);
    const action = actions.deployInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_CONTRACT_ADDRESS, updatedState);
  });
});

describe('start in AWaitForContractAddress', () => {
  describe('incoming action: deploy submitted', () => { // player A scenario
    const state = states.aWaitForContractAddress(defaultsPrefundA);
    const action = actions.deploySubmitted(defaults.adjudicator);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPLOY_CONFIRMATION, updatedState);
  });
});


describe('start in BWaitForDeployInitiation', () => {
  describe('incoming action: deploy initiated', () => { // player B scenario
    const state = states.bWaitForDeployInitiation(defaultsPrefundB);
    const action = actions.deployInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPLOY_CONFIRMATION, updatedState);
  });
});

describe('start in WaitForDeployConfirmation', () => {
  describe('incoming action: deploy finalised', () => { // player A scenario
    const state = states.waitForDeployConfirmation(defaultsPrefundA);
    const action = actions.deployFinalised();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_DEPOSIT_INITIATION, updatedState);
  });

  describe('incoming action: deploy finalised', () => { // player B scenario
    const state = states.waitForDeployConfirmation(defaultsPrefundB);
    const action = actions.deployFinalised();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_INITIATE_DEPOSIT, updatedState);
  });
});

describe('start in AWaitForDepositInitiation', () => {
  describe('incoming action: deposit initiated', () => { // player A scenario
    const state = states.aWaitForDepositInitiation(defaultsPrefundA);
    const action = actions.depositInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPOSIT_CONFIRMATION, updatedState);
  });
});

describe('start in BInitiateDeposti', () => {
  describe('incoming action: deposit initiated', () => { // player A scenario
    const state = states.bInitiateDeposit(defaultsPrefundA);
    const action = actions.depositInitiated();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_DEPOSIT_CONFIRMATION, updatedState);
  });
});

describe('start in WaitForDepositConfirmation', () => {
  describe('incoming action: deposit finalised', () => { // player A scenario
    const state = states.waitForDepositConfirmation(defaultsPrefundA);
    const action = actions.depositFinalised();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.A_WAIT_FOR_POST_FUND_SETUP, updatedState);
  });

  describe('incoming action: deposit finalised', () => { // player B scenario
    const state = states.waitForDepositConfirmation(defaultsPrefundB);
    const action = actions.depositFinalised();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.B_WAIT_FOR_POST_FUND_SETUP, updatedState);
  });
});

describe('start in AWaitForPostFundSetup', () => {
  describe('incoming action: B post fund setup', () => { // player A scenario
    const testDefaults = {
      ...defaultsA,
      penultimatePosition: preFundSetupBHex,
      lastPosition: postFundSetupAHex,
      turnNum: 2,
    };
    const state = states.aWaitForPostFundSetup(testDefaults);
    const action = actions.postFundSetupReceived(postFundSetupBHex, postFundSetupBSig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_FUNDING_SUCCESS, updatedState);
  });
});

describe('start in BWaitForPostFundSetup', () => {
  describe('incoming action: A post fund setup', () => { // player B scenario
    const state = states.bWaitForPostFundSetup(defaultsPrefundB);
    const action = actions.postFundSetupReceived(postFundSetupAHex, postFundSetupASig);
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.ACKNOWLEDGE_FUNDING_SUCCESS, updatedState);
  });
});

describe('start in AcknowledgeFundingSuccess', () => {
  describe('incoming action: FundingSuccessAcknowledged', () => { // player A scenario
    const testDefaults = {
      ...defaultsA,
      penultimatePosition: postFundSetupAHex,
      lastPosition: postFundSetupBHex,
      turnNum: 3,
    };
    const state = states.acknowledgeFundingSuccess(testDefaults);
    const action = actions.fundingSuccessAcknowledged();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
  });

  describe('incoming action: FundingSuccessAcknowledged', () => { // player B scenario
    const testDefaults = {
      ...defaultsB,
      penultimatePosition: postFundSetupAHex,
      lastPosition: postFundSetupBHex,
      turnNum: 3,
    };
    const state = states.acknowledgeFundingSuccess(testDefaults);
    const action = actions.fundingSuccessAcknowledged();
    const updatedState = walletReducer(state, action);

    itTransitionsToStateType(states.WAIT_FOR_UPDATE, updatedState);
  });

});
