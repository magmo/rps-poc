import {
  AdjudicatorExists
} from './shared';

// stage
export const WITHDRAWING = 'STAGE.WITHDRAWING';

// state types
export const APPROVE_WITHDRAWAL = 'APPROVE_WITHDRAWAL';
export const INITIATE_WITHDRAWAL = 'INITIATE_WITHDRAWAL';
export const WAIT_FOR_WITHDRAWAL_CONFIRMATION = 'WAIT_FOR_WITHDRAWAL_CONFIRMATION';
export const ACKNOWLEDGE_WITHDRAWAL_SUCCESS = 'ACKNOWLEDGE_WITHDRAWAL_SUCCESS';

interface ApproveWithdrawal extends AdjudicatorExists {
  type: typeof APPROVE_WITHDRAWAL;
  stage: typeof WITHDRAWING;
}

interface InitiateWithdrawal extends AdjudicatorExists {
  type: typeof INITIATE_WITHDRAWAL;
  stage: typeof WITHDRAWING;
}

interface WaitForWithdrawalConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_WITHDRAWAL_CONFIRMATION;
  stage: typeof WITHDRAWING;
}

interface AcknowledgeWithdrawalSuccess extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_WITHDRAWAL_SUCCESS;
  stage: typeof WITHDRAWING;
}

export type WithdrawingState = (
  | ApproveWithdrawal
  | InitiateWithdrawal
  | WaitForWithdrawalConfirmation
  | AcknowledgeWithdrawalSuccess
)
