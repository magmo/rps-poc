import { AdjudicatorExists, adjudicatorExists, ChannelOpen, channelOpen, AdjudicatorMightExist, adjudicatorMightExist, } from './shared';

// stage
export const CLOSING = 'CLOSING';

// state types
export const APPROVE_CONCLUDE = 'APPROVE_CONCLUDE';
export const WAIT_FOR_OPPONENT_CONCLUDE = 'WAIT_FOR_OPPONENT_CONCLUDE';
export const ACKNOWLEDGE_CONCLUDE_SUCCESS = 'ACKNOWLEDGE_CONCLUDE_SUCCESS';
export const ACKNOWLEDGE_CLOSE_SUCCESS = 'ACKNOWLEDGE_CLOSE_SUCCESS';
export const CLOSED_ON_CHAIN = 'CLOSED_ON_CHAIN';

export interface ApproveConclude extends AdjudicatorMightExist {
  type: typeof APPROVE_CONCLUDE;
  stage: typeof CLOSING;
}

export interface WaitForOpponentConclude extends AdjudicatorMightExist {
  type: typeof WAIT_FOR_OPPONENT_CONCLUDE;
  stage: typeof CLOSING;
}
export interface AcknowledgeConcludeSuccess extends AdjudicatorMightExist {
  type: typeof ACKNOWLEDGE_CONCLUDE_SUCCESS;
  stage: typeof CLOSING;
}

export interface AcknowledgeCloseSuccess extends ChannelOpen {
  type: typeof ACKNOWLEDGE_CLOSE_SUCCESS;
  stage: typeof CLOSING;
}

export interface ClosedOnChain extends AdjudicatorExists {
  type: typeof CLOSED_ON_CHAIN;
  stage: typeof CLOSING;
}

export function approveConclude<T extends AdjudicatorMightExist>(params: T): ApproveConclude {
  return { type: APPROVE_CONCLUDE, stage: CLOSING, ...adjudicatorMightExist(params) };
}

export function waitForOpponentConclude<T extends AdjudicatorMightExist>(params: T): WaitForOpponentConclude {
  return { type: WAIT_FOR_OPPONENT_CONCLUDE, stage: CLOSING, ...adjudicatorMightExist(params) };
}

export function acknowledgeConcludeSuccess<T extends AdjudicatorMightExist>(params: T): AcknowledgeConcludeSuccess {
  return { type: ACKNOWLEDGE_CONCLUDE_SUCCESS, stage: CLOSING, ...adjudicatorMightExist(params) };
}

export function acknowledgeCloseSuccess<T extends ChannelOpen>(params: T): AcknowledgeCloseSuccess {
  return { type: ACKNOWLEDGE_CLOSE_SUCCESS, stage: CLOSING, ...channelOpen(params) };
}
export function closedOnChain<T extends AdjudicatorExists>(params: T): ClosedOnChain {
  return { type: CLOSED_ON_CHAIN, stage: CLOSING, ...adjudicatorExists(params) };
}

export type ClosingState = (
  | ApproveConclude
  | WaitForOpponentConclude
  | AcknowledgeConcludeSuccess
  | ClosedOnChain
  | AcknowledgeCloseSuccess
);
