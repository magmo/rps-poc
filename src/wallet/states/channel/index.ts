import { InitializingState } from './initializing';
import { RunningState } from './running';
import { FundingState } from './funding';
import { ChallengingState } from './challenging';
import { RespondingState } from './responding';
import { WithdrawingState } from './withdrawing';
import { ClosingState } from './closing';

export type ChannelState = (
  | InitializingState
  | FundingState
  | RunningState
  | ChallengingState
  | RespondingState
  | WithdrawingState
  | ClosingState
);

export * from './initializing';
export * from './running';
export * from './funding';
export * from './challenging';
export * from './responding';
export * from './withdrawing';
export * from './closing';
