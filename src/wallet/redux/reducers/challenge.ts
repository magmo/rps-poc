import { Reducer } from 'redux';
import { SetChallenge, ClearChallenge,SET_CHALLENGE, CLEAR_CHALLENGE } from '../actions/challenge';

export type ChallengeState = any;

const initialState = null;

type ChallengeAction = SetChallenge | ClearChallenge;
export const challengeReducer: Reducer<ChallengeState> = (state=initialState, action: ChallengeAction) => {
  switch (action.type) {
    case SET_CHALLENGE:
      const { responseOptions, expirationTime, userIsChallenger } = action;
      return { responseOptions, expirationTime,userIsChallenger };
  case CLEAR_CHALLENGE:
      return {};
    default:
      return state;
  }
};
