
import {
  AdjudicatorExists
} from './shared';

export const ACKNOWLEDGE_CHALLENGE = 'ACKNOWLEDGE_CHALLENGE';
export const CHOOSE_RESPONSE = 'CHOOSE_RESPONSE';
export const ACKNOWLEDGE_MUST_TAKE_MOVE = 'ACKNOWELDGE_MUST_TAKE_MOVE';
export const TAKE_MOVE_IN_APP = 'TAKE_MOVE_IN_APP';
export const INTIATE_RESPONSE = 'INITIATE_RESPONSE';
export const WAIT_FOR_RESPONSE_CONFIRMATION = 'WAIT_FOR_RESPONSE_CONFIRMATION';

interface AcknowledgeChallenge extends AdjudicatorExists {
  name: typeof ACKNOWLEDGE_CHALLENGE;
}

interface ChooseResponse extends AdjudicatorExists {
  name: typeof CHOOSE_RESPONSE;
}

interface AcknowledgeMustTakeMove extends AdjudicatorExists {
  name: typeof ACKNOWLEDGE_MUST_TAKE_MOVE;
}

interface TakeMoveInApp extends AdjudicatorExists {
  name: typeof TAKE_MOVE_IN_APP;
}

interface InitiateResponse extends AdjudicatorExists {
  name: typeof INTIATE_RESPONSE;
}

interface WaitForResponseConfirmation extends AdjudicatorExists {
  name: typeof WAIT_FOR_RESPONSE_CONFIRMATION;
}

export type ResponderState = (
  | AcknowledgeChallenge 
  | ChooseResponse 
  | AcknowledgeMustTakeMove 
  | TakeMoveInApp 
  | InitiateResponse 
  | WaitForResponseConfirmation
);
