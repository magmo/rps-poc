import {
  ChannelState,
  INITIALIZING,
  FUNDING,
  RUNNING,
  CHALLENGING,
  RESPONDING,
  WITHDRAWING,
  CLOSING,
} from '../../../states/channel';

import { initializingReducer } from './initializing';
import { fundingReducer } from './funding';
import { runningReducer } from './running';
import { challengingReducer } from './challenging';
import { respondingReducer } from './responding';
import { withdrawingReducer } from './withdrawing';
import { closingReducer } from './closing';

export const channelReducer = (state: ChannelState, action: any): ChannelState => {
  switch (state.stage) {
    case INITIALIZING:
      return initializingReducer(state, action);
    case FUNDING:
      return fundingReducer(state, action);
    case RUNNING:
      return runningReducer(state, action);
    case CHALLENGING:
      return challengingReducer(state, action);
    case RESPONDING:
      return respondingReducer(state, action);
    case WITHDRAWING:
      return withdrawingReducer(state, action);
    case CLOSING:
      return closingReducer(state, action);
    default:
      return unreachable(state);
  }
};

function unreachable(x: never) { return x; }
