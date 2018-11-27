import {
  AdjudicatorExists, adjudicatorExists
} from './shared';

export const CHALLENGING = 'CHALLENGING';

export const APPROVE_CHALLENGE = "APPROVE_CHALLENGE";
export const INITIATE_CHALLENGE = 'INITIATE_CHALLENGE';
export const WAIT_FOR_CHALLENGE_CONFIRMATION = 'WAIT_FOR_CHALLENGE_CONFIRMATION';

export const WAIT_FOR_RESPONSE_OR_TIMEOUT = 'WAIT_FOR_RESPONSE_OR_TIMEOUT';
export const ACKNOWLEDGE_CHALLENGE_RESPONSE = 'ACKNOWLEDGE_CHALLENGE_RESPONSE';
export const ACKNOWLEDGE_CHALLENGE_TIMEOUT = 'ACKNOWLEDGE_CHALLENGE_TIMEOUT';

export interface ApproveChallenge extends AdjudicatorExists {
  type: typeof APPROVE_CHALLENGE;
  stage: typeof CHALLENGING;
}
export function approveChallenge<T extends AdjudicatorExists>(params: T): ApproveChallenge {
  return {
    type: APPROVE_CHALLENGE,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
  };
}

export interface InitiateChallenge extends AdjudicatorExists {
  type: typeof INITIATE_CHALLENGE;
  stage: typeof CHALLENGING;
}
export function initiateChallenge<T extends AdjudicatorExists>(params: T): InitiateChallenge {
  return {
    type: INITIATE_CHALLENGE,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
    transactionOutbox: { a: 'b' },
  };
}

export interface WaitForChallengeConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_CHALLENGE_CONFIRMATION;
  stage: typeof CHALLENGING;
}

export function waitForChallengeConfirmation<T extends AdjudicatorExists>(params: T): WaitForChallengeConfirmation {
  return {
    type: WAIT_FOR_CHALLENGE_CONFIRMATION,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
  };
}

export interface WaitForResponseOrTimeout extends AdjudicatorExists {
  type: typeof WAIT_FOR_RESPONSE_OR_TIMEOUT;
  stage: typeof CHALLENGING;
}

export function waitForResponseOrTimeout<T extends AdjudicatorExists>(params: T): WaitForResponseOrTimeout {
  return {
    type: WAIT_FOR_RESPONSE_OR_TIMEOUT,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
  };
}

export interface AcknowledgeChallengeResponse extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE_RESPONSE;
  stage: typeof CHALLENGING;
}


export function acknowledgeChallengeResponse<T extends AdjudicatorExists>(params: T): AcknowledgeChallengeResponse {
  return {
    type: ACKNOWLEDGE_CHALLENGE_RESPONSE,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
  };
}

export interface AcknowledgeChallengeTimeout extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE_TIMEOUT;
  stage: typeof CHALLENGING;
}

export function acknowledgeChallengeTimeout<T extends AdjudicatorExists>(params: T): AcknowledgeChallengeTimeout {
  return {
    type: ACKNOWLEDGE_CHALLENGE_TIMEOUT,
    stage: CHALLENGING,
    ...adjudicatorExists(params),
  };
}

export type ChallengingState = (
  | InitiateChallenge
  | WaitForChallengeConfirmation
  | WaitForResponseOrTimeout
  | AcknowledgeChallengeResponse
  | AcknowledgeChallengeTimeout
  | ApproveChallenge
);
