import { WalletAction } from '../actions';
import * as actions from '../actions';
import { unreachable } from '../../utils';
import { WalletState } from '../../states';
import * as states from '../../states/challenging';
import * as runningStates from '../../states/running';

export const challengingReducer = (state: states.ChallengingState, action: WalletAction): WalletState => {
  switch (state.type) {
    case states.APPROVE_CHALLENGE:
      return approveChallengeReducer(state, action);
    case states.INITIATE_CHALLENGE:
      return initiateChallengeReducer(state, action);
    case states.WAIT_FOR_CHALLENGE_CONFIRMATION:
      return waitForChallengeConfirmationReducer(state, action);
    case states.WAIT_FOR_RESPONSE_OR_TIMEOUT:
      return waitForResponseOrTimeoutReducer(state, action);
    case states.ACKNOWLEDGE_CHALLENGE_RESPONSE:
      return acknowledgeChallengeResponseReducer(state, action);
    case states.ACKNOWLEDGE_CHALLENGE_TIMEOUT:
      return acknowledgeChallengeTimeoutReducer(state, action);
    default:
      return unreachable(state);
  }
};

const approveChallengeReducer = (state: states.ApproveChallenge, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.APPROVE_CHALLENGE:
      return states.initiateChallenge({ ...state });
    case actions.DECLINE_CHALLENGE:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

const initiateChallengeReducer = (state: states.InitiateChallenge, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_INITIATED:
      return states.waitForChallengeConfirmation({ ...state });
    default:
      return state;
  }
};

const waitForChallengeConfirmationReducer = (state: states.WaitForChallengeConfirmation, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_CONFIRMED:
      return states.waitForResponseOrTimeout({ ...state });
    default:
      return state;
  }
};

const waitForResponseOrTimeoutReducer = (state: states.WaitForResponseOrTimeout, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_RESPONSE_RECEIVED:
      return states.acknowledgeChallengeResponse({ ...state });
    case actions.CHALLENGE_TIMEOUT:
      return states.acknowledgeChallengeTimeout({ ...state });
    default:
      return state;
  }
};

const acknowledgeChallengeResponseReducer = (state: states.AcknowledgeChallengeResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.ACKNOWLEDGE_CHALLENGE_RESPONSE:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

const acknowledgeChallengeTimeoutReducer = (state: states.AcknowledgeChallengeTimeout, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.ACKNOWLEDGE_CHALLENGE_TIMEOUT:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

