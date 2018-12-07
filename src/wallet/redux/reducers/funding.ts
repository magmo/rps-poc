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
    case states.B_WAIT_FOR_DEPLOY_ADDRESS:
      return bWaitForDeployAddressReducer(state, action);
    case states.WAIT_FOR_DEPLOY_CONFIRMATION:
      return waitForDeployConfirmationReducer(state, action);
    case states.B_INITIATE_DEPOSIT:
      return bInitiateDepositReducer(state, action);
    case states.A_WAIT_FOR_DEPOSIT_INITIATION:
      return aWaitForDepositInitiationReducer(state, action);
    case states.WAIT_FOR_DEPOSIT_CONFIRMATION:
      return waitForDepositConfirmationReducer(state, action);
    case states.B_WAIT_FOR_POST_FUND_SETUP:
      return bWaitForPostFundSetupReducer(state, action);
    case states.A_WAIT_FOR_POST_FUND_SETUP:
      return aWaitForPostFundSetupReducer(state, action);
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
      // TODO: inform opponent of the contract address
      return states.waitForDeployConfirmation({
        ...state,
        messageOutbox: undefined,
      });
    default:
      return state;
  }
};

const bWaitForDeployAddressReducer = (state: states.BWaitForDeployAddress, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.DEPLOY_ADDRESS_RECEIVED:
      return states.waitForDeployConfirmation({
        ...state,
        adjudicator: action.adjudicator,
      });
    default:
      return state;
  }
};

const waitForDeployConfirmationReducer = (state: states.WaitForDeployConfirmation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      if (state.ourIndex === 0) {

        return states.aWaitForDepositInitiation({ ...state, adjudicator: action.contractAddress as string, });
      } else {
        // TODO: deposit value should not be hardcoded.
        return states.bInitiateDeposit({
          ...state,
          adjudicator: action.contractAddress as string,
          transactionOutbox: createDepositTransaction(action.contractAddress as string, "1000"),
        });
      }
    default:
      return state;
  }
};

const bInitiateDepositReducer = (state: states.BInitiateDeposit, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      return states.waitForDepositConfirmation(state);
    default:
      return state;
  }
};

// TODO Should this exist?
const aWaitForDepositInitiationReducer = (state: states.AWaitForDepositInitiation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_SENT_TO_METAMASK:
      return states.waitForDepositConfirmation(state);
    default:
      return state;
  }
};

const waitForDepositConfirmationReducer = (state: states.WaitForDepositConfirmation, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      if (state.ourIndex === 0) {
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
      } else {
        return states.bWaitForPostFundSetup(state);
      }
    default:
      return state;
  }
};

const aWaitForPostFundSetupReducer = (state: states.AWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.POST_FUND_SETUP_RECEIVED:
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

const bWaitForPostFundSetupReducer = (state: states.BWaitForPostFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.POST_FUND_SETUP_RECEIVED:
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

const validPostFundState = (state: states.AWaitForPostFundSetup | states.BWaitForPostFundSetup, action: actions.PostFundSetupReceived) => {
  const postFundBPosition = decode(action.data);
  const opponentAddress = state.participants[1 - state.ourIndex];
  if (!validSignature(action.data, action.signature, opponentAddress)) { return false; }
  // check transition
  if (!validTransition(state, postFundBPosition)) { return false; }
  return true;
};