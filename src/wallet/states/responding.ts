import { AdjudicatorExists, adjudicatorExists } from './shared';

// stage
export const RESPONDING = 'RESPONDING';

// state types
export const ACKNOWLEDGE_CHALLENGE = 'ACKNOWLEDGE_CHALLENGE';
export const CHOOSE_RESPONSE = 'CHOOSE_RESPONSE';
export const ACKNOWLEDGE_MUST_TAKE_MOVE = 'ACKNOWELDGE_MUST_TAKE_MOVE';
export const TAKE_MOVE_IN_APP = 'TAKE_MOVE_IN_APP';
export const INTIATE_RESPONSE = 'INITIATE_RESPONSE';
export const WAIT_FOR_RESPONSE_CONFIRMATION = 'WAIT_FOR_RESPONSE_CONFIRMATION';

interface AcknowledgeChallenge extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CHALLENGE;
  stage: typeof RESPONDING;
}
export function acknowledgeChallenge<T extends AdjudicatorExists>(params: T): AcknowledgeChallenge {
  return { type: ACKNOWLEDGE_CHALLENGE, stage: RESPONDING, ...adjudicatorExists(params) };
}

interface ChooseResponse extends AdjudicatorExists {
  type: typeof CHOOSE_RESPONSE;
  stage: typeof RESPONDING;
}

interface AcknowledgeMustTakeMove extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_MUST_TAKE_MOVE;
  stage: typeof RESPONDING;
}

interface TakeMoveInApp extends AdjudicatorExists {
  type: typeof TAKE_MOVE_IN_APP;
  stage: typeof RESPONDING;
}

interface InitiateResponse extends AdjudicatorExists {
  type: typeof INTIATE_RESPONSE;
  stage: typeof RESPONDING;
}

interface WaitForResponseConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_RESPONSE_CONFIRMATION;
  stage: typeof RESPONDING;
}

export type RespondingState = (
  | AcknowledgeChallenge 
  | ChooseResponse 
  | AcknowledgeMustTakeMove 
  | TakeMoveInApp 
  | InitiateResponse 
  | WaitForResponseConfirmation
);
