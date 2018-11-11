import {
  AdjudicatorExists
} from './shared';

export const APPROVE_WITHDRAWAL = 'APPROVE_WITHDRAWAL';
export const INITIATE_WITHDRAWAL = 'INITIATE_WITHDRAWAL';
export const WAIT_FOR_WITHDRAWAL_CONFIRMATION = 'WAIT_FOR_WITHDRAWAL_CONFIRMATION';
export const ACKNOWLEDGE_WITHDRAWAL_SUCCESS = 'ACKNOWLEDGE_WITHDRAWAL_SUCCESS';

interface ApproveWithdrawal extends AdjudicatorExists {
  name: typeof APPROVE_WITHDRAWAL;
}

interface InitiateWithdrawal extends AdjudicatorExists {
  name: typeof INITIATE_WITHDRAWAL;
}

interface WaitForWithdrawalConfirmation extends AdjudicatorExists {
  name: typeof WAIT_FOR_WITHDRAWAL_CONFIRMATION;
}

interface AcknowledgeWithdrawalSuccess extends AdjudicatorExists {
  name: typeof ACKNOWLEDGE_WITHDRAWAL_SUCCESS;
}

export type WithdrawalState = (
  | ApproveWithdrawal
  | InitiateWithdrawal
  | WaitForWithdrawalConfirmation
  | AcknowledgeWithdrawalSuccess
)
