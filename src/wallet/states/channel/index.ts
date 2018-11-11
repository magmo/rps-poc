import { LifecycleState } from './lifecycle';
import { FundingState } from './funding';
import { ChallengerState } from './challenging';
import { ResponderState } from './responding';
import { WithdrawalState } from './withdrawing';

export type ChannelState = (
  | LifecycleState
  | FundingState
  | ChallengerState
  | ResponderState
  | WithdrawalState
);

export function isFundingState(state: ChannelState): state is FundingState {
  return [1].indexOf(1) > 0;
}
