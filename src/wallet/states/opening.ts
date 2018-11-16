import { ChannelPartiallyOpen, ChannelOpen, channelPartiallyOpen, channelOpen } from './shared';

// stage
export const OPENING = 'OPENING';

// state type
export const READY_TO_FUND = 'READY_TO_FUND';
export const PRE_FUND_SETUP = 'PRE_FUND_SETUP';

interface PreFundSetup extends ChannelPartiallyOpen {
  type: typeof PRE_FUND_SETUP;
  stage: typeof OPENING;
}

interface ReadyToFund extends ChannelOpen {
  type: typeof READY_TO_FUND;
  stage: typeof OPENING;
}

export function preFundSetup<T extends ChannelPartiallyOpen>(params: T): PreFundSetup {
  return { type: PRE_FUND_SETUP, stage: OPENING, ...channelPartiallyOpen(params) };
}
export function readyToFund<T extends ChannelOpen>(params: T): ReadyToFund {
  return { type: READY_TO_FUND, stage: OPENING, ...channelOpen(params) };
}

export type OpeningState = (
  | PreFundSetup
  | ReadyToFund
);
