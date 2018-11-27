import {
  AdjudicatorExists, adjudicatorExists
} from './shared';

export const CHALLENGING = 'CHALLENGING';

export const APPROVE_CHALLENGE = 'APPROVE_CHALLENGE';
export const INITIATE_CHALLENGE = 'INITIATE_CHALLENGE';
export const WAIT_FOR_CHALLENGE_CONFIRMATION = 'WAIT_FOR_CHALLENGE_CONFIRMATION';
export const WAIT_FOR_RESPONSE_OR_TIMEOUT = 'WAIT_FOR_RESPONSE_OR_TIMEOUT';
export const ACKNOWLEDGE_CHALLENGE_RESPONSE = 'ACKNOWLEDGE_CHALLENGE_RESPONSE';
export const ACKNOWLEDGE_CHALLENGE_TIMEOUT = 'ACKNOWLEDGE_CHALLENGE_TIMEOUT';

interface ApproveChallenge extends AdjudicatorExists {
  type: typeof APPROVE_CHALLENGE;
  stage: typeof CHALLENGING;
}
export function approveChallenge<T extends AdjudicatorExists>(params: T): ApproveChallenge {
  return { type: APPROVE_CHALLENGE, stage: CHALLENGING, ...adjudicatorExists(params) };
}

interface InitiateChallenge extends AdjudicatorExists {
  type: typeof INITIATE_CHALLENGE;
  stage: typeof CHALLENGING;
}

interface WaitForChallengeConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_CHALLENGE_CONFIRMATION;
  stage: typeof CHALLENGING;
}

interface WaitForResponseOrTimeout extends AdjudicatorExists {
  type: typeof WAIT_FOR_RESPONSE_OR_TIMEOUT;
  stage: typeof CHALLENGING;
}

interface AcknowledgeChallengeResponse extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE_RESPONSE;
  stage: typeof CHALLENGING;
}

interface AcknowledgeChallengeTimeout extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE_TIMEOUT;
  stage: typeof CHALLENGING;
}

export type ChallengingState = (
  | ApproveChallenge 
  | InitiateChallenge 
  | WaitForChallengeConfirmation 
  | WaitForResponseOrTimeout 
  | AcknowledgeChallengeResponse 
  | AcknowledgeChallengeTimeout 
);
