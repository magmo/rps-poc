import { Reducer } from 'redux';
import { ShowWallet, HideWallet, SHOW_WALLET, HIDE_WALLET } from '../actions/display';

type DisplayAction= ShowWallet | HideWallet;
export const displayReducer: Reducer<boolean> = (state=false, action: DisplayAction) => {
  switch (action.type) {
    case SHOW_WALLET:
  return true;
    case HIDE_WALLET:
      return false;
    default:
      return state;
  }
};
