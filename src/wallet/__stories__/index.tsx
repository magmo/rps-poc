import React from 'react';
import { storiesOf } from '@storybook/react';
import Wallet from '../containers/Wallet';
import { Provider } from 'react-redux';
import * as states from '../states';

import { scenarios } from '../../core';
import '../../index.scss';


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

const fakeStore = (state) => ({
  dispatch: action => {
    alert(`Action ${action.type} triggered`);
    return action;
  },
  getState: () => ({ wallet: state }), 
  subscribe: () => (() => {/* empty */ }),
  replaceReducer: () => { /* empty */ },
});

const testState = (state) => (
  () => (
    <Provider store={fakeStore(state)}>
      <Wallet children={<div/>} />
    </Provider>
  )
);

storiesOf('Wallet Screens / Funding / Player A', module)
  .add('ApproveFunding', testState(states.approveFunding(defaults)))
  .add('AInitiateDeploy', testState(states.aInitiateDeploy(defaults)))
  .add('WaitForDeployConfirmation', testState(states.waitForDeployConfirmation(defaults)))
  .add('AWaitForDepositInitiation', testState(states.aWaitForDepositInitiation(defaults)))
  .add('WaitForDepositConfirmation', testState(states.waitForDepositConfirmation(defaults)))
  .add('AWaitForPostFundSetup', testState(states.aWaitForPostFundSetup(defaults)))
  .add('AcknowledgeFundingSuccess', testState(states.acknowledgeFundingSuccess(defaults)));

storiesOf('Wallet Screens / Funding / Player B', module)
  .add('ApproveFunding', testState(states.approveFunding(defaults)))
  .add('BWaitForDeployInitiation', testState(states.bWaitForDeployInitiation(defaults)))
  .add('WaitForDeployConfirmation', testState(states.waitForDeployConfirmation(defaults)))
  .add('BInitiateDeposit', testState(states.bInitiateDeposit(defaults)))
  .add('WaitForDepositConfirmation', testState(states.waitForDepositConfirmation(defaults)))
  .add('BWaitForPostFundSetup', testState(states.bWaitForPostFundSetup(defaults)))
  .add('AcknowledgeFundingSuccess', testState(states.acknowledgeFundingSuccess(defaults)));

storiesOf('Wallet Screens / Withdrawing', module)
  .add('ApproveWithdrawal', testState(states.approveWithdrawal(defaults)))
  .add('InitiateWithdrawal', testState(states.initiateWithdrawal(defaults)))
  .add('WaitForWithdrawalConfirmation', testState(states.waitForWithdrawalConfirmation(defaults)))
  .add('AcknowledgeWithdrawalSuccess', testState(states.acknowledgeWithdrawalSuccess(defaults)));

storiesOf('Wallet Screens / Challenging', module)
  .add('ApproveChallenge', testState(states.approveChallenge(defaults)))
  .add('WaitForChallengeInitiation', testState(states.waitForChallengeInitiation({}, defaults)))
  .add('WaitForChallengeSubmission', testState(states.waitForChallengeSubmission(defaults)))
  .add('WaitForChallengeConfirmation', testState(states.waitForChallengeSubmission(defaults)))
  .add('WaitForResponseOrTimeout', testState(states.waitForResponseOrTimeout(defaults)))
  .add('AcknowledgeChallengeResponse', testState(states.acknowledgeChallengeResponse(defaults)))
  .add('AcknowledgeChallengeTimeout', testState(states.acknowledgeChallengeTimeout(defaults)));

storiesOf('Wallet Screens / Responding', module)
  .add('AcknowledgeChallenge', testState(states.approveChallenge(defaults)))
  .add('ChooseResponse', testState(states.chooseResponse(defaults)))
  .add('TakeMoveInApp', testState(states.takeMoveInApp(defaults)))
  .add('InitiateResponse', testState(states.initiateResponse(defaults)))
  .add('WaitForResponseSubmission', testState(states.waitForResponseSubmission(defaults)))
  .add('AcknowledgeChallengeComplete', testState(states.acknowledgeChallengeComplete(defaults)));
