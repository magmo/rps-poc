import { combineReducers } from 'redux';
import { WalletState, walletStateReducer } from './wallet-state';
import { ChallengeState, challengeReducer } from './challenge';
import { displayReducer } from './display';

export interface Wallet {
  walletState: WalletState;
  challenge: ChallengeState;
  showWallet:boolean;
  
}

export const walletReducer = combineReducers<Wallet>({
  walletState: walletStateReducer,
  challenge: challengeReducer,
  showWallet:  displayReducer,
});