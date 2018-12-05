import decode from '../../domain/decode';

import { WalletState, RespondingState } from '../../states';
import * as states from '../../states/responding';
import * as challengeStates from '../../states/challenging';
import * as runningStates from '../../states/running';
import { WalletAction } from '../actions';
import * as actions from '../actions';
import { unreachable, ourTurn, validTransition } from '../../utils/reducer-utils';
import { signPositionHex } from '../../utils/signing-utils';


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
    case actions.CHALLENGE_ACKNOWLEDGED:
      return states.chooseResponse(state);
    case actions.CHALLENGE_TIMED_OUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const chooseResponseReducer = (state: states.ChooseResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.RESPOND_WITH_MOVE_CHOSEN:
      return states.takeMoveInApp(state);
    case actions.RESPOND_WITH_REFUTE_CHOSEN:
      return states.initiateResponse(state);
    case actions.CHALLENGE_TIMED_OUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const takeMoveInAppReducer = (state: states.TakeMoveInApp, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.OWN_POSITION_RECEIVED:
      const data = action.data;
      const position = decode(data);
      // check it's our turn
      if (!ourTurn(state)) { return state; }

      // check transition
      if (!validTransition(state, position)) { return state; }

      const signature = signPositionHex(data, state.privateKey);

      return states.initiateResponse({
        ...state,
        turnNum: state.turnNum + 1,
        lastPosition: { data, signature },
        penultimatePosition: state.lastPosition,
      });
    case actions.CHALLENGE_TIMED_OUT:
      return challengeStates.acknowledgeChallengeTimeout(state);
    default:
      return state;
  }
};

export const initiateResponseReducer = (state: states.InitiateResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_SENT_TO_METAMASK:
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
    case actions.CHALLENGE_COMPLETION_ACKNOWLEDGED:
      return runningStates.waitForUpdate(state);
    default:
      return state;
  }
};
