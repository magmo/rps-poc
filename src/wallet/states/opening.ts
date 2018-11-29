import { AddressExists, addressExists, ChannelPartiallyOpen, ChannelOpen, channelPartiallyOpen, channelOpen } from './shared';

// stage
export const OPENING = 'OPENING';

// state type
export const WAIT_FOR_PRE_FUND_SETUP = 'WAIT_FOR_PRE_FUND_SETUP';
export const WAIT_FOR_FUNDING_REQUEST = 'WAIT_FOR_FUNDING_REQUEST';
export const WAIT_FOR_CHANNEL = 'WAIT_FOR_CHANNEL';


export interface WaitForChannel extends AddressExists {
  type: typeof WAIT_FOR_CHANNEL;
  stage: typeof OPENING;
}
export interface WaitForPreFundSetup extends ChannelPartiallyOpen {
  type: typeof WAIT_FOR_PRE_FUND_SETUP;
  stage: typeof OPENING;
}

export interface WaitForFundingRequest extends ChannelOpen {
  type: typeof WAIT_FOR_FUNDING_REQUEST;
  stage: typeof OPENING;
}

export function waitForChannel<T extends AddressExists>(params: T): WaitForChannel {
  return { type: WAIT_FOR_CHANNEL, stage: OPENING, ...addressExists(params) };
}
export function waitForPreFundSetup<T extends ChannelPartiallyOpen>(params: T): WaitForPreFundSetup {
  return { type: WAIT_FOR_PRE_FUND_SETUP, stage: OPENING, ...channelPartiallyOpen(params) };
}
export function waitForFundingRequest<T extends ChannelOpen>(params: T): WaitForFundingRequest {
  return { type: WAIT_FOR_FUNDING_REQUEST, stage: OPENING, ...channelOpen(params) };
}

export type OpeningState = (
  | WaitForChannel
  | WaitForPreFundSetup
  | WaitForFundingRequest
);
