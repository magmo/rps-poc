import * as states from '../../states';
import * as actions from '../actions';

import decode from '../../domain/decode';
import { validSignature, validTransition } from './utils';

import { unreachable } from '../../utils';

export const fundingReducer = (state: states.FundingState, action: actions.WalletAction): states.WalletState => {
  switch(state.type) {
    case states.WAIT_FOR_FUNDING_REQUEST:
      return waitForFundingRequestReducer(state, action);
    case states.APPROVE_FUNDING:
      return approveFundingReducer(state, action);
    case states.A_INITIATE_DEPLOY:
      return aInitiateDeployReducer(state, action);
    case states.B_WAIT_FOR_DEPLOY_INITIATION:
      return bWaitForDeployInitiationReducer(state, action);
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
  switch(action.type) {
    case actions.FUNDING_APPROVED:
      return states.approveFunding(state);
    default:
      return state;
  }
};

const approveFundingReducer = (state: states.ApproveFunding, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPLOY_INITIATED:
      if (state.ourIndex === 0) {
        return states.deployInitiated(state);
      } else {
        return states.bWaitForDeployInitiation(state);
      } 
    default:
      return state;
  }
};

const aInitiateDeployReducer = (state: states.AInitiateDeploy, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPLOY_SUBMITTED:
      return states.waitForDeployConfirmation({
        ...state,
        adjudicator: action.adjudicator,
      });
    default:
      return state;
  }
};

const bWaitForDeployInitiationReducer = (state: states.BWaitForDeployInitiation, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPLOY_SUBMITTED:
      return states.waitForDeployConfirmation({
        ...state,
        adjudicator: action.adjudicator,
      });
    default:
      return state;
  }
};

const waitForDeployConfirmationReducer = (state: states.WaitForDeployConfirmation, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPLOY_FINALISED:
      if (state.ourIndex === 0) {
        return states.aWaitForDepositInitiation(state);
      } else {
        return states.bInitiateDeposit(state);
      } 
    default:
      return state;
  }
};

const bInitiateDepositReducer = (state: states.BInitiateDeposit, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPOSIT_INITIATED:
      return states.waitForDepositConfirmation(state);
    default:
      return state;
  }
};

const aWaitForDepositInitiationReducer = (state: states.AWaitForDepositInitiation, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPOSIT_INITIATED:
      return states.waitForDepositConfirmation(state);
    default:
      return state;
  }
};

const waitForDepositConfirmationReducer = (state: states.WaitForDepositConfirmation, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.DEPOSIT_FINALISED:
      if (state.ourIndex === 0) {
        // TODO: validate state
        // TODO: send postfund state
        return states.aWaitForPostFundSetup(state);
      } else {
        return states.bWaitForPostFundSetup(state);
      }
    default:
      return state;
  }
};

const aWaitForPostFundSetupReducer = (state: states.AWaitForPostFundSetup, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.POST_FUND_SETUP_RECEIVED:
      const postFundBPosition = decode(action.data);

      // TODO: comment this back in once the test cases contain proper signatures
      // check signature
      // const opponentAddress = state.participants[1];
      // if (!validSignature(action.data, action.signature, opponentAddress)) { return state; }
      // check transition
      if (!validTransition(state, postFundBPosition)) { return state; }

      return states.acknowledgeFundingSuccess({
        ...state, 
        turnNum: state.turnNum + 1,
        lastPosition: action.data,
        penultimatePosition: state.lastPosition,

      });
    default:
      return state;
  }
};

const bWaitForPostFundSetupReducer = (state: states.BWaitForPostFundSetup, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.POST_FUND_SETUP_RECEIVED:
      return states.acknowledgeFundingSuccess(state);
    default:
      return state;
  }
};

const acknowledgeFundingSuccessReducer = (state: states.AcknowledgeFundingSuccess, action: actions.WalletAction) => {
  switch(action.type) {
    case actions.FUNDING_SUCCESS_ACKNOWLEDGED:
      return states.waitForUpdate(state);
    default:
      return state;
  }
};
