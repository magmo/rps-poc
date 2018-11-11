import { InitializingState } from './initializing';
import { RunningState } from './running';
import { FundingState } from './funding';
import { ChallengerState } from './challenging';
import { ResponderState } from './responding';
import { WithdrawalState } from './withdrawing';
import { ClosingState } from './closing';

export type ChannelState = (
  | InitializingState
  | FundingState
  | RunningState
  | ChallengerState
  | ResponderState
  | WithdrawalState
  | ClosingState
);

export function isFundingState(state: ChannelState): state is FundingState {
  return [1].indexOf(1) > 0;
}
