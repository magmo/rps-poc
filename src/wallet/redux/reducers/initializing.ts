import {
  WalletState,
  InitializingState,
  waitForChannel,
  WaitForLogin,
  WaitForAddress,
  WAIT_FOR_LOGIN,
  WAIT_FOR_ADDRESS,
  waitForAddress
} from '../../states';

import { WalletAction, KEYS_LOADED, LOGGED_IN } from '../actions';
import { unreachable } from '../../utils';

export const initializingReducer = (state: InitializingState, action: WalletAction): WalletState => {
  switch (state.type) {
    case WAIT_FOR_LOGIN:
      return waitForLoginReducer(state, action);
    case WAIT_FOR_ADDRESS:
      return waitForAddressReducer(state, action);
    default:
      return unreachable(state);
  }
};

const waitForLoginReducer = (state: WaitForLogin, action: any) => {
  switch (action.type) {
    case LOGGED_IN:
      const { uid } = action.uid;
      return waitForAddress({ ...state, uid });
    default:
      return state;
  }
};

const waitForAddressReducer = (state: WaitForAddress, action: any) => {
  switch (action.type) {
    case KEYS_LOADED:
      const { address, privateKey } = action;
      return waitForChannel({ ...state, address, privateKey });
    default:
      return state;
  }
};
