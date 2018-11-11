import {
  AdjudicatorExists
} from './shared';

export const APPROVE_CHALLENGE = 'APPROVE_CHALLENGE';
export const INITIATE_CHALLENGE = 'INITIATE_CHALLENGE';
export const WAIT_FOR_CHALLENGE_CONFIRMATION = 'WAIT_FOR_CHALLENGE_CONFIRMATION';
export const WAIT_FOR_RESPONSE_OR_TIMEOUT = 'WAIT_FOR_RESPONSE_OR_TIMEOUT';
export const ACKNOWLEDGE_CHALLENGE_RESPONSE = 'ACKNOWLEDGE_CHALLENGE_RESPONSE';
export const ACKNOWLEDGE_CHALLENGE_TIMEOUT = 'ACKNOWLEDGE_CHALLENGE_TIMEOUT';

interface ApproveChallenge extends AdjudicatorExists {
  name: typeof APPROVE_CHALLENGE;
}

interface InitiateChallenge extends AdjudicatorExists {
  name: typeof INITIATE_CHALLENGE;
}

interface WaitForChallengeConfirmation extends AdjudicatorExists {
  name: typeof WAIT_FOR_CHALLENGE_CONFIRMATION;
}

interface WaitForResponseOrTimeout extends AdjudicatorExists {
  name: typeof WAIT_FOR_RESPONSE_OR_TIMEOUT;
}

interface AcknowledgeChallengeResponse extends AdjudicatorExists {
  name: typeof ACKNOWLEDGE_CHALLENGE_RESPONSE;
}

interface AcknowledgeChallengeTimeout extends AdjudicatorExists {
  name: typeof ACKNOWLEDGE_CHALLENGE_TIMEOUT;
}

export type ChallengerState = (
  | ApproveChallenge 
  | InitiateChallenge 
  | WaitForChallengeConfirmation 
  | WaitForResponseOrTimeout 
  | AcknowledgeChallengeResponse 
  | AcknowledgeChallengeTimeout 
);
