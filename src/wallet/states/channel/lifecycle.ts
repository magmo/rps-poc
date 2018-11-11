import {
  OnePosition,
  onePosition,
  OnePositionParams,
  TwoPositions,
  twoPositions,
  TwoPositionsParams,
  AdjudicatorExists,
  adjudicatorExists,
  AdjudicatorExistsParams,
} from './shared';

export const PRE_FUND_SETUP = 'PRE_FUND_SETUP';
export const READY_TO_FUND = 'READY_TO_FUND';
export const APPROVE_FUNDING = 'APPROVE_FUNDING';
export const FUNDED = 'FUNDED';
export const CONCLUDING = 'CONCLUDING';
export const CONCLUDED = 'CONCLUDED';
export const CLOSED = 'CLOSED';
export const CLOSED_ON_CHAIN = 'CLOSED_ON_CHAIN';

export const lifecycleNames = [
  PRE_FUND_SETUP,
  READY_TO_FUND,
  APPROVE_FUNDING,
  FUNDED,
  CONCLUDING,
  CONCLUDED,
  CLOSED,
  CLOSED_ON_CHAIN,
];

interface PreFundSetup extends OnePosition { name: typeof PRE_FUND_SETUP; }
interface ReadyToFund extends TwoPositions { name: typeof READY_TO_FUND; }
interface ApproveFunding extends TwoPositions { name: typeof APPROVE_FUNDING; }
interface Funded extends AdjudicatorExists { name: typeof FUNDED; }
interface Concluding extends AdjudicatorExists { name: typeof CONCLUDING; }
interface Concluded extends AdjudicatorExists { name: typeof CONCLUDED; }
interface Closed extends TwoPositions { name: typeof CLOSED; }
interface ClosedOnChain extends AdjudicatorExists { name: typeof CLOSED_ON_CHAIN; }

export function preFundSetup(params: OnePositionParams): PreFundSetup {
  return { name: PRE_FUND_SETUP, ...onePosition(params) };
}
export function readyToFund(params: TwoPositionsParams): ReadyToFund {
  return { name: READY_TO_FUND, ...twoPositions(params) };
}
export function approveFunding(params: TwoPositionsParams): ApproveFunding {
  return { name: APPROVE_FUNDING, ...twoPositions(params) };
}
export function funded(params: AdjudicatorExistsParams): Funded {
  return { name: FUNDED, ...adjudicatorExists(params) };
}
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

export type LifecycleState = (
  | PreFundSetup
  | ReadyToFund
  | ApproveFunding 
  | Funded
  | ClosedOnChain 
  | Closed
  | Concluding
  | Concluded
);
