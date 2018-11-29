import { WalletState, RespondingState } from '../../states';
import * as states from '../../states/responding';
import * as challengeStates from '../../states/challenging';
import * as runningStates from '../../states/running';
import { WalletAction } from '../actions';
import * as actions from '../actions';
import { unreachable } from '../../utils';

export const respondingReducer = (state: RespondingState, action: WalletAction): WalletState => {
  switch (state.type) {
    case states.ACKNOWLEDGE_CHALLENGE:
      return acknowledgeChallengeReducer(state, action);
    case states.CHOOSE_RESPONSE:
      return chooseResponseReducer(state, action);
    case states.TAKE_MOVE_IN_APP:
      return takeMoveInAppReducer(state, action);
    case states.INITIATE_RESPONSE:
      return initiateResponseReducer(state, action);
    case states.WAIT_FOR_RESPONSE_SUBMISSION:
      return waitForResponseSubmissionReducer(state, action);
    case states.WAIT_FOR_RESPONSE_CONFIRMATION:
      return waitForResponseConfirmationReducer(state, action);
    case states.ACKNOWLEDGE_CHALLENGE_COMPLETE:
      return acknowledgeChallengeCompleteReducer(state, action);
    default:
      return unreachable(state);
  }

};

export const acknowledgeChallengeReducer = (state: states.AcknowledgeChallenge, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.ACKNOWLEDGE_CHALLENGE:
      return states.chooseResponse(state);
    case actions.CHALLENGE_TIMEOUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const chooseResponseReducer = (state: states.ChooseResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.SELECT_RESPOND_WITH_MOVE:
      return states.takeMoveInApp(state);
    case actions.SELECT_RESPOND_WITH_REFUTE:
      return states.initiateResponse(state);
    case actions.CHALLENGE_TIMEOUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const takeMoveInAppReducer = (state: states.TakeMoveInApp, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TAKE_MOVE_IN_APP:
      return states.initiateResponse(state);
    case actions.CHALLENGE_TIMEOUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const initiateResponseReducer = (state: states.InitiateResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_INITIATED:
      return states.waitForResponseSubmission(state);
    default:
      return state;
  }
};

export const waitForResponseSubmissionReducer = (state: states.WaitForResponseSubmission, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_SUBMITTED:
      return states.waitForResponseConfirmation(state);
    default:
      return state;
  }
};

export const waitForResponseConfirmationReducer = (state: states.WaitForResponseConfirmation, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      return states.acknowledgeChallengeComplete(state);
    default:
      return state;
  }
};

export const acknowledgeChallengeCompleteReducer = (state: states.AcknowledgeChallengeComplete, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.ACKNOWLEDGE_CHALLENGE_COMPLETE:
      return runningStates.waitForUpdate(state);
    default:
      return state;
  }
};