import * as CommonState from '../';

export class ReadyToDeploy {}
export class WaitForBlockchainDeploy {}
export class WaitForBToDeposit {}
export const AdjudicatorReceived = CommonState.AdjudicatorReceived;
export const FundingFailed = CommonState.FundingFailed;
export const WaitForApproval = CommonState.WaitForApproval;
export const Funded = CommonState.Funded;
export type PlayerAState =
  | ReadyToDeploy
  | WaitForBlockchainDeploy
  | WaitForBToDeposit
  | CommonState.WaitForApproval
  | CommonState.FundingFailed
  | CommonState.AdjudicatorReceived
  |CommonState.Funded;
