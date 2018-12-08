import * as states from '../../states';
import * as actions from '../actions';
import { sendMessage, fundingSuccess } from '../../interface/outgoing';

import decode from '../../domain/decode';
import encode from '../../../core/encode';

import { postFundSetupA, postFundSetupB } from '../../../core/positions';
import { unreachable, validTransition } from '../../utils/reducer-utils';
import { createDeployTransaction, createDepositTransaction } from '../../utils/transaction-generator';
import { validSignature, signPositionHex } from '../../utils/signing-utils';

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
        // TODO: the deposit should not be hardcoded.
        return states.aWaitForDeployToBeSentToMetaMask({
          ...state,
          transactionOutbox: createDeployTransaction(state.networkId, state.channelId, "0x5"),
        });
      } else {
        return states.bWaitForDeployAddress(state);
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
      const postFundStateA = postFundSetupA({
        ...state,
        turnNum: state.turnNum + 1,
        roundBuyIn: "1000",
        balances: ["0", "0"],
      });
      const positionData = encode(postFundStateA);
      const positionSignature = signPositionHex(positionData, state.privateKey);

      const sendMessageAction = sendMessage(state.participants[1 - state.ourIndex], positionData, positionSignature);
      return states.aWaitForPostFundSetup({
        ...state,
        lastPosition: { data: positionData, signature: positionSignature },
        penultimatePosition: state.lastPosition,
        messageOutbox: sendMessageAction,
      });
    default:
      return state;
  }
};

const aWaitForPostFundSetupReducer = (state: states.AWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      if (!action.signature) { return state; }
      if (!validPostFundState(state, action)) { return state; }

      return states.acknowledgeFundingSuccess({
        ...state,
        turnNum: state.turnNum + 1,
        lastPosition: { data: action.data, signature: action.signature },
        penultimatePosition: state.lastPosition,
      });
    default:
      return state;
  }
};

const bWaitForDeployAddressReducer = (state: states.BWaitForDeployAddress, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      // TODO: deposit value should not be hardcoded.
      return states.bWaitForDepositToBeSentToMetaMask({
        ...state,
        adjudicator: action.data,
        transactionOutbox: createDepositTransaction(action.data, "0x5"),
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
    default:
      return state;
  }
};

const waitForDepositConfirmationReducer = (state: states.WaitForDepositConfirmation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      return states.bWaitForPostFundSetup(state);
    default:
      return state;
  }
};

const bWaitForPostFundSetupReducer = (state: states.BWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      if (!action.signature) { return state; }
      if (!validPostFundState(state, action)) { return state; }

      const postFundStateB = postFundSetupB({
        ...state,
        turnNum: state.turnNum + 1,
        roundBuyIn: "1000",
        balances: ["0", "0"],
      });
      const positionData = encode(postFundStateB);
      const positionSignature = signPositionHex(positionData, state.privateKey);

      const sendMessageAction = sendMessage(state.participants[1 - state.ourIndex], positionData, positionSignature);
      return states.acknowledgeFundingSuccess({
        ...state,
        lastPosition: { data: positionData, signature: positionSignature },
        penultimatePosition: state.lastPosition,
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
        messageOutbox: fundingSuccess(state.channelId),
      });
    default:
      return state;
  }
};

const validPostFundState = (state: states.AWaitForPostFundSetup | states.BWaitForPostFundSetup, action: actions.MessageReceived) => {
  const postFundBPosition = decode(action.data);
  const opponentAddress = state.participants[1 - state.ourIndex];
  if (!action.signature) { return state; }
  if (!validSignature(action.data, action.signature, opponentAddress)) { return false; }
  // check transition
  if (!validTransition(state, postFundBPosition)) { return false; }
  return true;
};