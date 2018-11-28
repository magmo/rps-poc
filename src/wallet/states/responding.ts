import { AdjudicatorExists, adjudicatorExists } from './shared';

// stage
export const RESPONDING = 'RESPONDING';

// state types
export const ACKNOWLEDGE_CHALLENGE = 'ACKNOWLEDGE_CHALLENGE';
export const CHOOSE_RESPONSE = 'CHOOSE_RESPONSE';
export const SELECT_CHALLENGE_RESPONSE = 'SELECT_CHALLENGE_RESPONSE';
export const TAKE_MOVE_IN_APP = 'TAKE_MOVE_IN_APP';
export const INITIATE_RESPONSE = 'INITIATE_RESPONSE';
export const WAIT_FOR_RESPONSE_CONFIRMATION = 'WAIT_FOR_RESPONSE_CONFIRMATION';
export const WAIT_FOR_RESPONSE_SUBMISSION = 'WAIT_FOR_RESPONSE_SUBMISSION';
export const ACKNOWLEDGE_CHALLENGE_COMPLETE = 'ACKNOWLEDGE_CHALLENGE_COMPLETE';
export interface AcknowledgeChallenge extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE;
  stage: typeof RESPONDING;
}
export function acknowledgeChallenge<T extends AdjudicatorExists>(params: T): AcknowledgeChallenge {
  return { type: ACKNOWLEDGE_CHALLENGE, stage: RESPONDING, ...adjudicatorExists(params) };
}

export interface ChooseResponse extends AdjudicatorExists {
  type: typeof CHOOSE_RESPONSE;
  stage: typeof RESPONDING;
}
export function chooseResponse<T extends AdjudicatorExists>(params: T): ChooseResponse {
  return { type: CHOOSE_RESPONSE, stage: RESPONDING, ...adjudicatorExists(params) };
}
export interface TakeMoveInApp extends AdjudicatorExists {
  type: typeof TAKE_MOVE_IN_APP;
  stage: typeof RESPONDING;
}
export function takeMoveInApp<T extends AdjudicatorExists>(params: T): TakeMoveInApp {
  return { type: TAKE_MOVE_IN_APP, stage: RESPONDING, ...adjudicatorExists(params) };
}

export interface InitiateResponse extends AdjudicatorExists {
  type: typeof INITIATE_RESPONSE;
  stage: typeof RESPONDING;
}
export function initiateResponse<T extends AdjudicatorExists>(params: T): InitiateResponse {
  return { type: INITIATE_RESPONSE, stage: RESPONDING, ...adjudicatorExists(params) };
}

export interface WaitForResponseSubmission extends AdjudicatorExists {
  type: typeof WAIT_FOR_RESPONSE_SUBMISSION;
  stage: typeof RESPONDING;
}
export function waitForResponseSubmission<T extends AdjudicatorExists>(params: T): WaitForResponseSubmission {
  return { type: WAIT_FOR_RESPONSE_SUBMISSION, stage: RESPONDING, ...adjudicatorExists(params) };
}

export interface WaitForResponseConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_RESPONSE_CONFIRMATION;
  stage: typeof RESPONDING;
}
export function waitForResponseConfirmation<T extends AdjudicatorExists>(params: T): WaitForResponseConfirmation {
  return { type: WAIT_FOR_RESPONSE_CONFIRMATION, stage: RESPONDING, ...adjudicatorExists(params) };
}

export interface AcknowledgeChallengeComplete extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE_COMPLETE;
  stage: typeof RESPONDING;
}
export function acknowledgeChallengeComplete<T extends AdjudicatorExists>(params: T): AcknowledgeChallengeComplete {
  return { type: ACKNOWLEDGE_CHALLENGE_COMPLETE, stage: RESPONDING, ...adjudicatorExists(params) };
}

export type RespondingState = (
  | AcknowledgeChallenge
  | ChooseResponse
  | TakeMoveInApp
  | InitiateResponse
  | WaitForResponseSubmission
  | WaitForResponseConfirmation
  | AcknowledgeChallengeComplete
);
