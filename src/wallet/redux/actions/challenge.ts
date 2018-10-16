import { ChallengeResponse } from "../../domain/ChallengeResponse";
import { State } from "fmg-core";
import { ChallengeStatus } from "../../domain/ChallengeStatus";

export const SET_CHALLENGE = 'CHALLENGE.SET_CHALLENGE';
export const SEND_CHALLENGE_POSITION = 'CHALLENGE.POSITION.SEND';
export const SET_CHALLENGE_STATUS = 'CHALLENGE.SET_CHALLENGE_STATUS';
export const CLEAR_CHALLENGE = 'CHALLENGE.CLEAR_CHALLENGE';
export const SELECT_MOVE_RESPONSE = "CHALLENGE.SELECT_MOVE_RESPONSE";

export const setChallenge = (expirationTime, responseOptions: ChallengeResponse[], status: ChallengeStatus, ) => ({
  type: SET_CHALLENGE as typeof SET_CHALLENGE,
  expirationTime,
  responseOptions,
  status,
});
export const setChallengeStatus = (status: ChallengeStatus) => ({
  type: SET_CHALLENGE_STATUS as typeof SET_CHALLENGE_STATUS,
  status,
});

export const sendChallengePosition = (position: State) => ({
  type: SEND_CHALLENGE_POSITION as typeof SEND_CHALLENGE_POSITION,
  position,
});

export const clearChallenge = () => ({
  type: CLEAR_CHALLENGE as typeof CLEAR_CHALLENGE,
});

export const selectMoveResponse = () => ({
  type: SELECT_MOVE_RESPONSE as typeof SELECT_MOVE_RESPONSE,
});



export type SetChallenge = ReturnType<typeof setChallenge>;
export type SendChallengePosition = ReturnType<typeof sendChallengePosition>;
export type ClearChallenge = ReturnType<typeof clearChallenge>;
export type SetChallengeStatus = ReturnType<typeof setChallengeStatus>;
export type SelectMoveResponse = ReturnType<typeof selectMoveResponse>;




