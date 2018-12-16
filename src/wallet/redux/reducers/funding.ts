import * as states from '../../states';
import * as actions from '../actions';
import { sendMessage, fundingSuccess, fundingFailure } from '../../interface/outgoing';

import decode, { extractGameAttributes } from '../../domain/decode';
import { unreachable, validTransition } from '../../utils/reducer-utils';
import { createDeployTransaction, createDepositTransaction } from '../../utils/transaction-generator';
import { validSignature, signPositionHex } from '../../utils/signing-utils';

import BN from 'bn.js';
import { State, Channel } from 'fmg-core';


export const fundingReducer = (state: states.FundingState, action: actions.WalletAction): states.WalletState => {
  switch (state.type) {
    case states.WAIT_FOR_FUNDING_REQUEST:
      return waitForFundingRequestReducer(state, action);
    case states.APPROVE_FUNDING:
      return approveFundingReducer(state, action);
    case states.A_WAIT_FOR_DEPLOY_TO_BE_SENT_TO_METAMASK:
      return aWaitForDeployToBeSentToMetaMaskReducer(state, action);
    case states.A_SUBMIT_DEPLOY_IN_METAMASK:
      return aSubmitDeployToMetaMaskReducer(state, action);
    case states.WAIT_FOR_DEPLOY_CONFIRMATION:
      return waitForDeployConfirmationReducer(state, action);
    case states.A_WAIT_FOR_DEPOSIT:
      return aWaitForDepositReducer(state, action);
    case states.A_WAIT_FOR_POST_FUND_SETUP:
      return aWaitForPostFundSetupReducer(state, action);
    case states.B_WAIT_FOR_DEPLOY_ADDRESS:
      return bWaitForDeployAddressReducer(state, action);
    case states.B_WAIT_FOR_DEPOSIT_TO_BE_SENT_TO_METAMASK:
      return bWaitForDepositToBeSentToMetaMaskReducer(state, action);
    case states.B_SUBMIT_DEPOSIT_IN_METAMASK:
      return bSubmitDepositInMetaMaskReducer(state, action);
    case states.WAIT_FOR_DEPOSIT_CONFIRMATION:
      return waitForDepositConfirmationReducer(state, action);
    case states.B_WAIT_FOR_POST_FUND_SETUP:
      return bWaitForPostFundSetupReducer(state, action);
    case states.ACKNOWLEDGE_FUNDING_SUCCESS:
      return acknowledgeFundingSuccessReducer(state, action);
    default:
      return unreachable(state);
  }
};

const waitForFundingRequestReducer = (state: states.WaitForFundingRequest, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.FUNDING_REQUESTED:
      return states.approveFunding(state);
    default:
      return state;
  }
};

const approveFundingReducer = (state: states.ApproveFunding, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.FUNDING_APPROVED:
      if (state.ourIndex === 0) {
        const fundingAmount = getFundingAmount(state, state.ourIndex);
        return states.aWaitForDeployToBeSentToMetaMask({
          ...state,
          transactionOutbox: createDeployTransaction(state.networkId, state.channelId, fundingAmount),
        });
      } else {
        if (!state.adjudicator) {
          return states.bWaitForDeployAddress(state);
        }
        const fundingAmount = getFundingAmount(state, state.ourIndex);
        return states.bWaitForDepositToBeSentToMetaMask({
          ...state,
          adjudicator: state.adjudicator as string,
          transactionOutbox: createDepositTransaction(state.adjudicator as string, fundingAmount),
        });
      }
    case actions.FUNDING_REJECTED:
      return states.waitForChannel({
        ...state,
        messageOutbox: fundingFailure(state.channelId, action.type),
      });
    case actions.MESSAGE_RECEIVED:
      if (state.ourIndex === 1) {
        return states.approveFunding({
          ...state,
          adjudicator: action.data,
        });
      }
    default:
      return state;
  }
};

const aWaitForDeployToBeSentToMetaMaskReducer = (state: states.AWaitForDeployToBeSentToMetaMask, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_SENT_TO_METAMASK:
      return states.aSubmitDeployInMetaMask(state);
    default:
      return state;
  }
};

const aSubmitDeployToMetaMaskReducer = (state: states.ASubmitDeployInMetaMask, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_SUBMITTED:
      return states.waitForDeployConfirmation({
        ...state,
      });
    case actions.TRANSACTION_SUBMISSION_FAILED:
      return states.waitForChannel({
        ...state,
        messageOutbox: fundingFailure(state.channelId, action.error),
      });
    default:
      return state;
  }
};

const waitForDeployConfirmationReducer = (state: states.WaitForDeployConfirmation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      const sendAdjudicatorAddressAction = sendMessage(state.participants[1 - state.ourIndex], action.contractAddress as string, "");
      return states.aWaitForDeposit({
        ...state,
        adjudicator: action.contractAddress as string,
        messageOutbox: sendAdjudicatorAddressAction,
      });
    default:
      return state;
  }
};

const aWaitForDepositReducer = (state: states.AWaitForDeposit, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.FUNDING_RECEIVED_EVENT:
      const resolutions = decode(state.lastPosition.data).resolution;
      const totalFunds = resolutions[state.ourIndex].add(resolutions[1 - state.ourIndex]);
      const adjudicatorBalance = new BN(action.adjudicatorBalance.substring(2), 16);
      if (adjudicatorBalance.cmp(totalFunds)) {
        return state;
      }

      const { positionData, positionSignature, sendMessageAction } = composePostFundState(state);
      return states.aWaitForPostFundSetup({
        ...state,
        turnNum: decode(positionData).turnNum,
        penultimatePosition: state.lastPosition,
        lastPosition: { data: positionData, signature: positionSignature },
        messageOutbox: sendMessageAction,
      });
    default:
      return state;
  }
};

const aWaitForPostFundSetupReducer = (state: states.AWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      if (!validPostFundState(state, action)) { return state; }

      const postFundPosition = decode(action.data);
      return states.acknowledgeFundingSuccess({
        ...state,
        turnNum: postFundPosition.turnNum,
        lastPosition: { data: action.data, signature: action.signature as string },
        penultimatePosition: state.lastPosition,
      });
    default:
      return state;
  }
};

const bWaitForDeployAddressReducer = (state: states.BWaitForDeployAddress, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      const fundingAmount = getFundingAmount(state, state.ourIndex);
      return states.bWaitForDepositToBeSentToMetaMask({
        ...state,
        adjudicator: action.data,
        transactionOutbox: createDepositTransaction(action.data, fundingAmount),
      });
    default:
      return state;
  }
};

const bWaitForDepositToBeSentToMetaMaskReducer = (state: states.BWaitForDepositToBeSentToMetaMask, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_SENT_TO_METAMASK:
      return states.bSubmitDepositInMetaMask(state);
    default:
      return state;
  }
};

const bSubmitDepositInMetaMaskReducer = (state: states.BSubmitDepositInMetaMask, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_SUBMITTED:
      return states.waitForDepositConfirmation(state);
    case actions.TRANSACTION_SUBMISSION_FAILED:
      return states.waitForChannel({
        ...state,
        messageOutbox: fundingFailure(state.channelId, action.error),
      });
    default:
      return state;
  }
};

const waitForDepositConfirmationReducer = (state: states.WaitForDepositConfirmation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      return states.waitForDepositConfirmation({
        ...state,
        turnNum: decode(action.data).turnNum,
        penultimatePosition: state.lastPosition,
        lastPosition: { data: action.data, signature: action.signature as string },
      });
    case actions.TRANSACTION_CONFIRMED:
      const lastPositionState = decode(state.lastPosition.data);
      // Player B already received PostFund state from A
      if (lastPositionState.stateType === 1) {
        const { positionData, positionSignature, sendMessageAction } = composePostFundState(state);
        return states.acknowledgeFundingSuccess({
          ...state,
          turnNum: decode(positionData).turnNum,
          lastPosition: { data: positionData, signature: positionSignature },
          penultimatePosition: state.lastPosition,
          messageOutbox: sendMessageAction,
        });
      }

      return states.bWaitForPostFundSetup(state);
    case actions.MESSAGE_RECEIVED:
      if (!validPostFundState(state, action)) {
        return state;
      }
      const postFundPosition = decode(action.data);
      return states.waitForDepositConfirmation({
        ...state,
        turnNum: postFundPosition.turnNum,
        lastPosition: { data: action.data, signature: action.signature as string },
        penultimatePosition: state.lastPosition,
      });
    default:
      return state;
  }
};

const bWaitForPostFundSetupReducer = (state: states.BWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      if (!validPostFundState(state, action)) {
        return state;
      }

      const newState = { ...state, turnNum: decode(action.data).turnNum };
      const { positionData, positionSignature, sendMessageAction } = composePostFundState(newState);
      const postFundPosition = decode(positionData);
      return states.acknowledgeFundingSuccess({
        ...newState,
        turnNum: postFundPosition.turnNum,
        lastPosition: { data: positionData, signature: positionSignature },
        penultimatePosition: { data: action.data, signature: action.signature as string },
        messageOutbox: sendMessageAction,
      });
    default:
      return state;
  }
};

const acknowledgeFundingSuccessReducer = (state: states.AcknowledgeFundingSuccess, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.FUNDING_SUCCESS_ACKNOWLEDGED:
      return states.waitForUpdate({
        ...state,
        messageOutbox: fundingSuccess(state.channelId, state.lastPosition.data),
      });
    default:
      return state;
  }
};

const validPostFundState = (state: states.FundingState, action: actions.MessageReceived) => {
  if (!action.signature) { return false; }
  const postFundPosition = decode(action.data);
  const opponentAddress = state.participants[1 - state.ourIndex];

  if (!validSignature(action.data, action.signature, opponentAddress)) { return false; }
  // check transition
  if (!validTransition(state, postFundPosition)) { return false; }

  return true;
};

const composePostFundState = (state: states.AWaitForDeposit | states.WaitForDepositConfirmation | states.BWaitForPostFundSetup) => {
  const lastState = decode(state.lastPosition.data);
  const { libraryAddress, channelNonce, participants, turnNum } = state;
  const channel = new Channel(libraryAddress, channelNonce, participants);

  const channelState = new State({
    channel,
    stateType: State.StateType.PostFundSetup,
    turnNum: turnNum + 1,
    stateCount: state.ourIndex,
    resolution: lastState.resolution,
  });

  const positionData = channelState.toHex() + extractGameAttributes(state.lastPosition.data);
  const positionSignature = signPositionHex(positionData, state.privateKey);

  const sendMessageAction = sendMessage(state.participants[1 - state.ourIndex], positionData, positionSignature);
  return { positionData, positionSignature, sendMessageAction };
};

const getFundingAmount = (state: states.FundingState, index: number): string => {
  const decodedPosition = decode(state.lastPosition.data);
  return "0x" + decodedPosition.resolution[index].toString("hex");
};