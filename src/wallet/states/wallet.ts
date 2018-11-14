import { ChannelState } from './channel';

export const INITIALIZING = 'INITIAL';
export const IDLE = 'IDLE';
export const RUNNING = 'RUNNING';

export enum DisplayMode {
  None,
  Minimized,
  Full,
}

export interface Initializing {
  type: typeof INITIALIZING;
  display: DisplayMode;
}
export function initial(display=DisplayMode.None): Initializing {
  return { type: INITIALIZING, display };
}

export interface Idle {
  type: typeof IDLE;
  display: DisplayMode;
  address: string;
}

export interface Running {
  type: typeof RUNNING;
  display: DisplayMode;
  address: string;
  channel: ChannelState;
}

export type WalletState = (
  | Initializing
  | Idle
  | Running
);
