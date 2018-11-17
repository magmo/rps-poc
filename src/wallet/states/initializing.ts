import { DisplayMode, Base, AddressExists, addressExists, LoggedIn, loggedIn } from "./shared";

export const INITIALIZING = 'INITIALIZING';

export const WAIT_FOR_LOGIN = 'WAIT_FOR_LOGIN';
export const WAIT_FOR_ADDRESS = 'WAIT_FOR_ADDRESS';
export const WAIT_FOR_CHANNEL = 'WAIT_FOR_CHANNEL';

export interface WaitForLogin extends Base {
  type: typeof WAIT_FOR_LOGIN;
  stage: typeof INITIALIZING;
}
export function waitForLogin<T extends Partial<Base>>(params = {} as T): WaitForLogin {
  const displayMode = params.displayMode || DisplayMode.None;
  return { type: WAIT_FOR_LOGIN, stage: INITIALIZING, displayMode };
}

export interface WaitForAddress extends LoggedIn {
  type: typeof WAIT_FOR_ADDRESS;
  stage: typeof INITIALIZING;
}

export function waitForAddress<T extends WaitForAddress>(params: T): WaitForAddress {
  return { ...loggedIn(params), type: WAIT_FOR_ADDRESS, stage: INITIALIZING };
}

export interface WaitForChannel extends AddressExists {
  type: typeof WAIT_FOR_CHANNEL;
  stage: typeof INITIALIZING;
}
export function waitForChannel<T extends AddressExists>(params: T): WaitForChannel {
  return { type: WAIT_FOR_CHANNEL, stage: INITIALIZING, ...addressExists(params) };
}

export type InitializingState = (
  | WaitForLogin
  | WaitForAddress
  | WaitForChannel
);
