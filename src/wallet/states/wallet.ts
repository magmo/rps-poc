import { ChannelState } from './channel';

export const INITIAL_STATE = 'INITIAL_STATE';

export enum DisplayMode {
  None,
  Minimized,
  Full,
}

interface Initial {
  name: 'INITIAL_STATE';
  display: DisplayMode;
}

interface Idle {
  name: 'READY_STATE';
  display: DisplayMode;
  address: string;
}

interface Running {
  name: 'RUNNING';
  display: DisplayMode;
  address: string;
  channel: ChannelState;
}

export type WalletState = (
  | Initial
  | Idle
  | Running
);
