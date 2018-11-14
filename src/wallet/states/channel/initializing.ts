import {
  OnePosition,
  onePosition,
  OnePositionParams,
  TwoPositions,
  twoPositions,
  TwoPositionsParams,
} from './shared';

// stage
export const INITIALIZING = 'INITIALIZING';

// state type
export const READY_TO_FUND = 'READY_TO_FUND';
export const PRE_FUND_SETUP = 'PRE_FUND_SETUP';

export const lifecycleNames = [
  PRE_FUND_SETUP,
  READY_TO_FUND,
];


interface PreFundSetup extends OnePosition {
  type: typeof PRE_FUND_SETUP;
  stage: typeof INITIALIZING;
}

interface ReadyToFund extends TwoPositions {
  type: typeof READY_TO_FUND;
  stage: typeof INITIALIZING;
}


export function preFundSetup(params: OnePositionParams): PreFundSetup {
  return { type: PRE_FUND_SETUP, stage: INITIALIZING, ...onePosition(params) };
}
export function readyToFund(params: TwoPositionsParams): ReadyToFund {
  return { type: READY_TO_FUND, stage: INITIALIZING, ...twoPositions(params) };
}

export type InitializingState = (
  | PreFundSetup
  | ReadyToFund
);
