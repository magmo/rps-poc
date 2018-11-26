import { WalletState, OpeningState, WaitForChannel, WAIT_FOR_CHANNEL, WAIT_FOR_PRE_FUND_SETUP, WAIT_FOR_FUNDING_REQUEST } from '../../states';
import { WalletAction } from '../actions';
import { unreachable } from '../../utils';

export const openingReducer = (state: OpeningState, action: WalletAction): WalletState => {
  switch(state.type) {
    case WAIT_FOR_CHANNEL:
      return waitForChannelReducer(state, action);
    case WAIT_FOR_PRE_FUND_SETUP:
    case WAIT_FOR_FUNDING_REQUEST:
      return state;
    default:
      return unreachable(state);
  }
};

const waitForChannelReducer = (state: WaitForChannel, action: any) => {
  return state;
};
