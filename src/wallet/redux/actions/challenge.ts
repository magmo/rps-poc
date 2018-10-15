import { ChallengeResponse } from "../../domain/ChallengeResponse";

export const SET_CHALLENGE = 'CHALLENGE.SET_CHALLENGE';
export const CLEAR_CHALLENGE = 'CHALLENGE.CLEAR_CHALLENGE';

export const setChallenge = (expirationTime, responseOptions: ChallengeResponse[], userIsChallenger:boolean) => ({
  type: SET_CHALLENGE as typeof SET_CHALLENGE,
  expirationTime,
  responseOptions,
  userIsChallenger,
});

export const clearChallenge = () => ({
  type: CLEAR_CHALLENGE as typeof CLEAR_CHALLENGE,
});

export type SetChallenge = ReturnType<typeof setChallenge>;
export type ClearChallenge = ReturnType<typeof clearChallenge>;