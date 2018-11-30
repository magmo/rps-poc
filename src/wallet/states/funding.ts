import { AdjudicatorExists, ChannelOpen, channelOpen, adjudicatorExists, } from './shared';

// stage
export const FUNDING = 'FUNDING';

// state types
export const WAIT_FOR_FUNDING_REQUEST = 'WAIT_FOR_FUNDING_REQUEST';
export const APPROVE_FUNDING = 'APPROVE_FUNDING';
export const A_INITIATE_DEPLOY = 'A_INITIATE_DEPLOY';
export const A_WAIT_FOR_CONTRACT_ADDRESS = 'A_WAIT_FOR_CONTRACT_ADDRESS';
export const B_WAIT_FOR_DEPLOY_INITIATION = 'B_WAIT_FOR_DEPLOY_INITIATION';
export const WAIT_FOR_DEPLOY_CONFIRMATION = 'WAIT_FOR_DEPLOY_CONFIRMATION';
export const B_INITIATE_DEPOSIT = 'B_INITIATE_DEPOSIT';
export const A_WAIT_FOR_DEPOSIT_INITIATION = 'A_WAIT_FOR_DEPOSIT_INITIATION';
export const WAIT_FOR_DEPOSIT_CONFIRMATION = 'WAIT_FOR_DEPOSIT_CONFIRMATION';
export const B_WAIT_FOR_POST_FUND_SETUP = 'B_WAIT_FOR_POST_FUND_SETUP';
export const A_WAIT_FOR_POST_FUND_SETUP = 'A_WAIT_FOR_POST_FUND_SETUP';
export const ACKNOWLEDGE_FUNDING_SUCCESS = 'ACKNOWLEDGE_FUNDING_SUCCESS';

export interface WaitForFundingRequest extends ChannelOpen {
  type: typeof WAIT_FOR_FUNDING_REQUEST;
  stage: typeof FUNDING;
}

export interface ApproveFunding extends ChannelOpen {
  type: typeof APPROVE_FUNDING;
  stage: typeof FUNDING;
}

export interface AInitiateDeploy extends ChannelOpen {
  type: typeof A_INITIATE_DEPLOY;
  stage: typeof FUNDING;
}

export interface AWaitForContractAddress extends ChannelOpen {
  type: typeof A_WAIT_FOR_CONTRACT_ADDRESS;
  stage: typeof FUNDING;
}


export interface BWaitForDeployInitiation extends ChannelOpen {
  type: typeof B_WAIT_FOR_DEPLOY_INITIATION;
  stage: typeof FUNDING;
}

export interface WaitForDeployConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_DEPLOY_CONFIRMATION;
  stage: typeof FUNDING;
}

export interface BInitiateDeposit extends AdjudicatorExists {
  type: typeof B_INITIATE_DEPOSIT;
  stage: typeof FUNDING;
}

export interface AWaitForDepositInitiation extends AdjudicatorExists {
  type: typeof A_WAIT_FOR_DEPOSIT_INITIATION;
  stage: typeof FUNDING;
}

export interface WaitForDepositConfirmation extends AdjudicatorExists {
  type: typeof WAIT_FOR_DEPOSIT_CONFIRMATION;
  stage: typeof FUNDING;
}


export interface AWaitForPostFundSetup extends AdjudicatorExists {
  type: typeof A_WAIT_FOR_POST_FUND_SETUP;
  stage: typeof FUNDING;
}

export interface BWaitForPostFundSetup extends AdjudicatorExists {
  type: typeof B_WAIT_FOR_POST_FUND_SETUP;
  stage: typeof FUNDING;
}

export interface AcknowledgeFundingSuccess extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_FUNDING_SUCCESS;
  stage: typeof FUNDING;
}

export function waitForFundingRequest<T extends ChannelOpen>(params: T): WaitForFundingRequest {
  return { type: WAIT_FOR_FUNDING_REQUEST, stage: FUNDING, ...channelOpen(params) };
}

export function approveFunding<T extends ChannelOpen>(params: T): ApproveFunding {
  return { type: APPROVE_FUNDING, stage: FUNDING, ...channelOpen(params) };
}

export function aInitiateDeploy<T extends ChannelOpen>(params: T): AInitiateDeploy {
  return { type: A_INITIATE_DEPLOY, stage: FUNDING, ...channelOpen(params) };
}

export function aWaitForContractAddress<T extends ChannelOpen>(params: T): AWaitForContractAddress {
  return { type: A_WAIT_FOR_CONTRACT_ADDRESS, stage: FUNDING, ...channelOpen(params) };
}


export function bWaitForDeployInitiation<T extends ChannelOpen>(params: T): BWaitForDeployInitiation {
  return { type: B_WAIT_FOR_DEPLOY_INITIATION, stage: FUNDING, ...channelOpen(params) };
}

export function waitForDeployConfirmation<T extends AdjudicatorExists>(params: T): WaitForDeployConfirmation {
  return { type: WAIT_FOR_DEPLOY_CONFIRMATION, stage: FUNDING, ...adjudicatorExists(params) };
}

export function aWaitForDepositInitiation<T extends AdjudicatorExists>(params: T): AWaitForDepositInitiation {
  return { type: A_WAIT_FOR_DEPOSIT_INITIATION, stage: FUNDING, ...adjudicatorExists(params) };
}

export function bInitiateDeposit<T extends AdjudicatorExists>(params: T): BInitiateDeposit {
  return { type: B_INITIATE_DEPOSIT, stage: FUNDING, ...adjudicatorExists(params) };
}

export function waitForDepositConfirmation<T extends AdjudicatorExists>(params: T): WaitForDepositConfirmation {
  return { type: WAIT_FOR_DEPOSIT_CONFIRMATION, stage: FUNDING, ...adjudicatorExists(params) };
}

export function aWaitForPostFundSetup<T extends AdjudicatorExists>(params: T): AWaitForPostFundSetup {
  return { type: A_WAIT_FOR_POST_FUND_SETUP, stage: FUNDING, ...adjudicatorExists(params) };
}

export function bWaitForPostFundSetup<T extends AdjudicatorExists>(params: T): BWaitForPostFundSetup {
  return { type: B_WAIT_FOR_POST_FUND_SETUP, stage: FUNDING, ...adjudicatorExists(params) };
}

export function acknowledgeFundingSuccess<T extends AdjudicatorExists>(params: T): AcknowledgeFundingSuccess {
  return { type: ACKNOWLEDGE_FUNDING_SUCCESS, stage: FUNDING, ...adjudicatorExists(params) };
}

export type FundingState = (
  | WaitForFundingRequest
  | ApproveFunding
  | AInitiateDeploy
  | AWaitForContractAddress
  | BWaitForDeployInitiation
  | WaitForDeployConfirmation
  | BInitiateDeposit
  | AWaitForDepositInitiation
  | WaitForDepositConfirmation
  | BWaitForPostFundSetup
  | AWaitForPostFundSetup
  | AcknowledgeFundingSuccess
);
