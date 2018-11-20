import { ChannelPartiallyOpen, ChannelOpen, channelPartiallyOpen, channelOpen } from './shared';

// stage
export const OPENING = 'OPENING';

// state type
export const WAIT_FOR_PRE_FUND_SETUP = 'WAIT_FOR_PRE_FUND_SETUP';
export const WAIT_FOR_FUNDING_REQUEST = 'WAIT_FOR_FUNDING_REQUEST';

interface WaitForPreFundSetup extends ChannelPartiallyOpen {
  type: typeof WAIT_FOR_PRE_FUND_SETUP;
  stage: typeof OPENING;
}

interface WaitForFundingRequest extends ChannelOpen {
  type: typeof WAIT_FOR_FUNDING_REQUEST;
  stage: typeof OPENING;
}

export function waitForPreFundSetup<T extends ChannelPartiallyOpen>(params: T): WaitForPreFundSetup {
  return { type: WAIT_FOR_PRE_FUND_SETUP, stage: OPENING, ...channelPartiallyOpen(params) };
}
export function waitForFundingRequest<T extends ChannelOpen>(params: T): WaitForFundingRequest {
  return { type: WAIT_FOR_FUNDING_REQUEST, stage: OPENING, ...channelOpen(params) };
}

export type OpeningState = (
  | WaitForPreFundSetup
  | WaitForFundingRequest
);
