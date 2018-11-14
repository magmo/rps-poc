import {
  TwoPositions,
  twoPositions,
  TwoPositionsParams,
  AdjudicatorExists,
  adjudicatorExists,
  AdjudicatorExistsParams,
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

export function concluding(params: AdjudicatorExistsParams): Concluding {
  return { type: CONCLUDING, stage: CLOSING, ...adjudicatorExists(params) };
}
export function concluded(params: AdjudicatorExistsParams): Concluded {
  return { type: CONCLUDED, stage: CLOSING, ...adjudicatorExists(params) };
}
export function closed(params: TwoPositionsParams): Closed {
  return { type: CLOSED, stage: CLOSING, ...twoPositions(params) };
}
export function closedOnChain(params: AdjudicatorExistsParams): ClosedOnChain {
  return { type: CLOSED_ON_CHAIN, stage: CLOSING, ...adjudicatorExists(params) };
}

export type ClosingState = (
  | ClosedOnChain 
  | Closed
  | Concluding
  | Concluded
);
