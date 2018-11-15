import {
  OnePosition,
  onePosition,
  TwoPositions,
  twoPositions,
} from './shared';

// stage
export const OPENING = 'OPENING';

// state type
export const READY_TO_FUND = 'READY_TO_FUND';
export const PRE_FUND_SETUP = 'PRE_FUND_SETUP';

export const lifecycleNames = [
  PRE_FUND_SETUP,
  READY_TO_FUND,
];


interface PreFundSetup extends OnePosition {
  type: typeof PRE_FUND_SETUP;
  stage: typeof OPENING;
}

interface ReadyToFund extends TwoPositions {
  type: typeof READY_TO_FUND;
  stage: typeof OPENING;
}


export function preFundSetup<T extends OnePosition>(params: T): PreFundSetup {
  return { type: PRE_FUND_SETUP, stage: OPENING, ...onePosition(params) };
}
export function readyToFund<T extends TwoPositions>(params: T): ReadyToFund {
  return { type: READY_TO_FUND, stage: OPENING, ...twoPositions(params) };
}

export type OpeningState = (
  | PreFundSetup
  | ReadyToFund
);
