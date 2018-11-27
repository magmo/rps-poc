import { WalletState, RespondingState } from '../../states';
import * as states from '../../states/responding';
import * as challengeStates from '../../states/challenging';
import { WalletAction } from '../actions';
import * as actions from '../actions';

export const respondingReducer = (state: RespondingState, action: WalletAction): WalletState => {
  switch (state.type) {
    case states.ACKNOWLEDGE_CHALLENGE:
      return acknowledgeChallengeReducer(state, action);
    default:
      return state;
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