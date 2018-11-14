import {
  TwoPositions,
  twoPositions,
  AdjudicatorExists,
  adjudicatorExists,
} from './shared';

// stage
export const CLOSING = 'CLOSING';

// state types
export const CONCLUDING = 'CONCLUDING';
export const CONCLUDED = 'CONCLUDED';
export const CLOSED = 'CLOSED';
export const CLOSED_ON_CHAIN = 'CLOSED_ON_CHAIN';

interface Concluding extends AdjudicatorExists {
  type: typeof CONCLUDING;
  stage: typeof CLOSING;
}

interface Concluded extends AdjudicatorExists {
  type: typeof CONCLUDED;
  stage: typeof CLOSING;
}

interface Closed extends TwoPositions {
  type: typeof CLOSED;
  stage: typeof CLOSING;
}

interface ClosedOnChain extends AdjudicatorExists {
  type: typeof CLOSED_ON_CHAIN;
  stage: typeof CLOSING;
}

export function concluding<T extends AdjudicatorExists>(params: T): Concluding {
  return { type: CONCLUDING, stage: CLOSING, ...adjudicatorExists(params) };
}
export function concluded<T extends AdjudicatorExists>(params: T): Concluded {
  return { type: CONCLUDED, stage: CLOSING, ...adjudicatorExists(params) };
}
export function closed<T extends TwoPositions>(params: T): Closed {
  return { type: CLOSED, stage: CLOSING, ...twoPositions(params) };
}
export function closedOnChain<T extends AdjudicatorExists>(params: T): ClosedOnChain {
  return { type: CLOSED_ON_CHAIN, stage: CLOSING, ...adjudicatorExists(params) };
}

export type ClosingState = (
  | ClosedOnChain 
  | Closed
  | Concluding
  | Concluded
);
