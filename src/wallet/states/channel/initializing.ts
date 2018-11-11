import {
  OnePosition,
  onePosition,
  OnePositionParams,
  TwoPositions,
  twoPositions,
  TwoPositionsParams,
} from './shared';

export const READY_TO_FUND = 'READY_TO_FUND';
export const PRE_FUND_SETUP = 'PRE_FUND_SETUP';

export const lifecycleNames = [
  PRE_FUND_SETUP,
  READY_TO_FUND,
];


interface PreFundSetup extends OnePosition { name: typeof PRE_FUND_SETUP; }
interface ReadyToFund extends TwoPositions { name: typeof READY_TO_FUND; }


export function preFundSetup(params: OnePositionParams): PreFundSetup {
  return { name: PRE_FUND_SETUP, ...onePosition(params) };
}
export function readyToFund(params: TwoPositionsParams): ReadyToFund {
  return { name: READY_TO_FUND, ...twoPositions(params) };
}

export type InitializingState = (
  | PreFundSetup
  | ReadyToFund
);
