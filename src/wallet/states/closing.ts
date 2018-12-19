import { AdjudicatorExists, adjudicatorExists, ChannelOpen, channelOpen, } from './shared';

// stage
export const CLOSING = 'CLOSING';

// state types
export const APPROVE_CONCLUDE = 'APPROVE_CONCLUDE';
export const WAIT_FOR_OPPONENT_CONCLUDE = 'WAIT_FOR_OPPONENT_CONCLUDE';
export const ACKNOWLEDGE_CONCLUDE_SUCCESS = 'ACKNOWLEDGE_CONCLUDE_SUCCESS';
export const CLOSED = 'CLOSED';
export const CLOSED_ON_CHAIN = 'CLOSED_ON_CHAIN';

export interface ApproveConclude extends AdjudicatorExists {
  type: typeof APPROVE_CONCLUDE;
  stage: typeof CLOSING;
}

export interface WaitForOpponentConclude extends AdjudicatorExists {
  type: typeof WAIT_FOR_OPPONENT_CONCLUDE;
  stage: typeof CLOSING;
}
export interface AcknowledgeConcludeSuccess extends AdjudicatorExists {
  type: typeof ACKNOWLEDGE_CONCLUDE_SUCCESS;
  stage: typeof CLOSING;
}

export interface Closed extends ChannelOpen {
  type: typeof CLOSED;
  stage: typeof CLOSING;
}

export interface ClosedOnChain extends AdjudicatorExists {
  type: typeof CLOSED_ON_CHAIN;
  stage: typeof CLOSING;
}

export function approveConclude<T extends AdjudicatorExists>(params: T): ApproveConclude {
  return { type: APPROVE_CONCLUDE, stage: CLOSING, ...adjudicatorExists(params) };
}

export function waitForOpponentConclude<T extends AdjudicatorExists>(params: T): WaitForOpponentConclude {
  return { type: WAIT_FOR_OPPONENT_CONCLUDE, stage: CLOSING, ...adjudicatorExists(params) };
}

export function acknowledgeConcludeSuccess<T extends AdjudicatorExists>(params: T): AcknowledgeConcludeSuccess {
  return { type: ACKNOWLEDGE_CONCLUDE_SUCCESS, stage: CLOSING, ...adjudicatorExists(params) };
}

export function closed<T extends ChannelOpen>(params: T): Closed {
  return { type: CLOSED, stage: CLOSING, ...channelOpen(params) };
}
export function closedOnChain<T extends AdjudicatorExists>(params: T): ClosedOnChain {
  return { type: CLOSED_ON_CHAIN, stage: CLOSING, ...adjudicatorExists(params) };
}

export type ClosingState = (
  | ApproveConclude
  | WaitForOpponentConclude
  | AcknowledgeConcludeSuccess
  | ClosedOnChain
  | Closed
);
