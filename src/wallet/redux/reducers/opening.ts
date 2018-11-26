import { WalletState, OpeningState, WaitForChannel, WAIT_FOR_CHANNEL, WAIT_FOR_PRE_FUND_SETUP } from '../../states';
import { WalletAction } from '../actions';
import { unreachable } from '../../utils';

export const openingReducer = (state: OpeningState, action: WalletAction): WalletState => {
  switch(state.type) {
    case WAIT_FOR_CHANNEL:
      return waitForChannelReducer(state, action);
    case WAIT_FOR_PRE_FUND_SETUP:
      return state;
    default:
      return unreachable(state);
  }
};

const waitForChannelReducer = (state: WaitForChannel, action: any) => {
  return state;
};
