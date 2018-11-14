import {
  TwoPositions,
  twoPositions,
  AdjudicatorExists,
} from './shared';

// stage
export const FUNDING = 'FUNDING';

// state types
export const APPROVE_FUNDING = 'APPROVE_FUNDING';
export const A_INITIATE_DEPLOY = 'A_INITIATE_DEPLOY';
export const B_WAIT_FOR_DEPLOY_INITIATION = 'B_WAIT_FOR_DEPLOY_INITIATION';
export const WAIT_FOR_DEPLOY_CONFIRMATION = 'WAIT_FOR_DEPLOY_CONFIRMATION';
export const B_INITIATE_DEPOSIT = 'B_INITIATE_DEPOSIT';
export const A_WAIT_FOR_DEPOSIT_INITIATION = 'A_WAIT_FOR_DEPOSIT_INITIATION';
export const WAIT_FOR_DEPOSIT_CONFIRMATION = 'WAIT_FOR_DEPOSIT_CONFIRMATION';
export const B_WAIT_FOR_POST_FUND_SETUP = 'B_WAIT_FOR_POST_FUND_SETUP';
export const A_WAIT_FOR_POST_FUND_SETUP = 'A_WAIT_FOR_POST_FUND_SETUP';
export const ACKNOWLEDGE_FUNDING_SUCCESS = 'ACKNOWLEDGE_FUNDING_SUCCESS';

interface ApproveFunding extends TwoPositions {
  type: typeof APPROVE_FUNDING;
  stage: typeof FUNDING;
}

interface AInitiateDeploy extends TwoPositions {
  type: typeof A_INITIATE_DEPLOY;
  stage: typeof FUNDING;
}

interface BWaitForDeployInitiation extends TwoPositions {
  type: typeof B_WAIT_FOR_DEPLOY_INITIATION;
  stage: typeof FUNDING;
}

interface WaitForDeployConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_DEPLOY_CONFIRMATION;
  stage: typeof FUNDING;
}

interface BInitiateDeposit extends AdjudicatorExists {
  type: typeof B_INITIATE_DEPOSIT;
  stage: typeof FUNDING;
}

interface AWaitForDepositInitiation extends AdjudicatorExists {
  type: typeof A_WAIT_FOR_DEPOSIT_INITIATION;
  stage: typeof FUNDING;
}

interface WaitForDepositConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_DEPOSIT_CONFIRMATION;
  stage: typeof FUNDING;
}

interface BWaitForPostFundSetup extends AdjudicatorExists {
  type: typeof B_WAIT_FOR_POST_FUND_SETUP;
  stage: typeof FUNDING;
}

interface AWaitForPostFundSetup extends AdjudicatorExists {
  type: typeof A_WAIT_FOR_POST_FUND_SETUP;
  stage: typeof FUNDING;
}

interface AcknowledgeFundingSuccess extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_FUNDING_SUCCESS;
  stage: typeof FUNDING;
}


export function approveFunding<T extends TwoPositions>(params: T): ApproveFunding {
  return { type: APPROVE_FUNDING, stage: FUNDING, ...twoPositions(params) };
}

export type FundingState = (
  | ApproveFunding
  | AInitiateDeploy
  | BWaitForDeployInitiation
  | WaitForDeployConfirmation
  | BInitiateDeposit
  | AWaitForDepositInitiation
  | WaitForDepositConfirmation
  | BWaitForPostFundSetup
  | AWaitForPostFundSetup
  | AcknowledgeFundingSuccess
);
