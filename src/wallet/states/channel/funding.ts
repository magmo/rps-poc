import {
  TwoPositions,
  TwoPositionsParams,
  twoPositions,
  AdjudicatorExists,
} from './shared';

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

interface ApproveFunding extends TwoPositions { name: typeof APPROVE_FUNDING; }
interface AInitiateDeploy extends TwoPositions { name: typeof A_INITIATE_DEPLOY; }
interface BWaitForDeployInitiation extends TwoPositions { name: typeof B_WAIT_FOR_DEPLOY_INITIATION; }
interface WaitForDeployConfirmation extends AdjudicatorExists { name: typeof WAIT_FOR_DEPLOY_CONFIRMATION; }
interface BInitiateDeposit extends AdjudicatorExists { name: typeof B_INITIATE_DEPOSIT; }
interface AWaitForDepositInitiation extends AdjudicatorExists { name: typeof A_WAIT_FOR_DEPOSIT_INITIATION; }
interface WaitForDepositConfirmation extends AdjudicatorExists { name: typeof WAIT_FOR_DEPOSIT_CONFIRMATION; }
interface BWaitForPostFundSetup extends AdjudicatorExists { name: typeof B_WAIT_FOR_POST_FUND_SETUP; }
interface AWaitForPostFundSetup extends AdjudicatorExists { name: typeof A_WAIT_FOR_POST_FUND_SETUP; }
interface AcknowledgeFundingSuccess extends AdjudicatorExists { name: typeof ACKNOWLEDGE_FUNDING_SUCCESS; }

export function approveFunding(params: TwoPositionsParams): ApproveFunding {
  return { name: APPROVE_FUNDING, ...twoPositions(params) };
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
