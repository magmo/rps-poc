import {
  TwoPositions,
  twoPositions,
  TwoPositionsParams,
  AdjudicatorExists,
  adjudicatorExists,
  AdjudicatorExistsParams,
} from './shared';

export const CONCLUDING = 'CONCLUDING';
export const CONCLUDED = 'CONCLUDED';
export const CLOSED = 'CLOSED';
export const CLOSED_ON_CHAIN = 'CLOSED_ON_CHAIN';

interface Concluding extends AdjudicatorExists { name: typeof CONCLUDING; }
interface Concluded extends AdjudicatorExists { name: typeof CONCLUDED; }
interface Closed extends TwoPositions { name: typeof CLOSED; }
interface ClosedOnChain extends AdjudicatorExists { name: typeof CLOSED_ON_CHAIN; }

export function concluding(params: AdjudicatorExistsParams): Concluding {
  return { name: CONCLUDING, ...adjudicatorExists(params) };
}
export function concluded(params: AdjudicatorExistsParams): Concluded {
  return { name: CONCLUDED, ...adjudicatorExists(params) };
}
export function closed(params: TwoPositionsParams): Closed {
  return { name: CLOSED, ...twoPositions(params) };
}
export function closedOnChain(params: AdjudicatorExistsParams): ClosedOnChain {
  return { name: CLOSED_ON_CHAIN, ...adjudicatorExists(params) };
}

export type ClosingState = (
  | ClosedOnChain 
  | Closed
  | Concluding
  | Concluded
);
