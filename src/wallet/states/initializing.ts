import { DisplayMode, Base, AddressExists, addressExists } from "./shared";

export const INITIALIZING = 'INITIALIZING';

export const WAIT_FOR_ADDRESS = 'WAIT_FOR_ADDRESS';
export const WAIT_FOR_CHANNEL = 'WAIT_FOR_CHANNEL';

export interface WaitForAddress extends Base {
  type: typeof WAIT_FOR_ADDRESS;
  stage: typeof INITIALIZING;
}
export function waitForAddress<T extends Partial<Base>>(params = {} as T): WaitForAddress {
  const displayMode = params.displayMode || DisplayMode.None;
  return { type: WAIT_FOR_ADDRESS, stage: INITIALIZING, displayMode };
}

export interface WaitForChannel extends AddressExists {
  type: typeof WAIT_FOR_CHANNEL;
  stage: typeof INITIALIZING;
}
export function waitForChannel<T extends AddressExists>(params: T): WaitForChannel {
  return { type: WAIT_FOR_CHANNEL, stage: INITIALIZING, ...addressExists(params) };
}

export type InitializingState = (
  | WaitForAddress
  | WaitForChannel
);
