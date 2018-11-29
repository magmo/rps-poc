import { DisplayMode, Base, LoggedIn, loggedIn } from "./shared";

export const INITIALIZING = 'INITIALIZING';

export const WAIT_FOR_LOGIN = 'WAIT_FOR_LOGIN';
export const WAIT_FOR_ADDRESS = 'WAIT_FOR_ADDRESS';

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

export function waitForAddress<T extends LoggedIn>(params: T): WaitForAddress {
  return { ...loggedIn(params), type: WAIT_FOR_ADDRESS, stage: INITIALIZING };
}

export type InitializingState = (
  | WaitForLogin
  | WaitForAddress
);
