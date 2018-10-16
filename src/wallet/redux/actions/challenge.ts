import { ChallengeResponse } from "../../domain/ChallengeResponse";
import { State } from "fmg-core";

export const SET_CHALLENGE = 'CHALLENGE.SET_CHALLENGE';
export const SEND_CHALLENGE_POSITION = 'CHALLENGE.POSITION.SEND';
export const CLEAR_CHALLENGE = 'CHALLENGE.CLEAR_CHALLENGE';

export const setChallenge = (expirationTime, responseOptions: ChallengeResponse[], userIsChallenger:boolean) => ({
  type: SET_CHALLENGE as typeof SET_CHALLENGE,
  expirationTime,
  responseOptions,
  userIsChallenger,
});

export const sendChallengePosition = (position: State) => ({
  type: SEND_CHALLENGE_POSITION as typeof SEND_CHALLENGE_POSITION,
  position,
});

export const clearChallenge = () => ({
  type: CLEAR_CHALLENGE as typeof CLEAR_CHALLENGE,
});

export type SetChallenge = ReturnType<typeof setChallenge>;
export type SendChallengePosition = ReturnType<typeof sendChallengePosition>;
export type ClearChallenge = ReturnType<typeof clearChallenge>;