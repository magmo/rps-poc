import { Reducer } from 'redux';
import { WalletState, initial, INITIALIZING, IDLE, RUNNING } from '../../states/wallet';
import { channelReducer } from './channel';

const initialState = initial();

export const walletReducer: Reducer<WalletState> = (state = initialState, action: any) => {
  switch (state.type) {
    case INITIALIZING:
      return state;
    case IDLE:
      return state;
    case RUNNING:
      return { ...state, channel: channelReducer(state.channel, action) }
    default:
      return state;
  }
};

