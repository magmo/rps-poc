import { Reducer } from 'redux';
import { SHOW_RESPONSE_SCREEN, CLOSE_RESPONSE_SCREEN, ShowResponseScreen, CloseResponseScreen, ShowWaitingScreen, SHOW_WAITING_SCREEN, CLOSE_WAITING_SCREEN, CloseWaitingScreen } from '../actions/challenge';

export type ChallengeState = any;

const initialState = null;

type ChallengeAction = ShowResponseScreen | CloseResponseScreen | ShowWaitingScreen | CloseWaitingScreen;
export const challengeReducer: Reducer<ChallengeState> = (state=initialState, action: ChallengeAction) => {
  switch (action.type) {
    case SHOW_RESPONSE_SCREEN:
      const { responseOptions, expirationTime } = action;
      return { responseOptions, expirationTime };
    case SHOW_WAITING_SCREEN:
      return { expirationTime: action.expirationTime };
    case CLOSE_RESPONSE_SCREEN:
    case CLOSE_WAITING_SCREEN:
      return {};
    default:
      return state;
  }
};
