import { combineReducers } from 'redux';
import { WalletState, walletStateReducer } from './wallet-state';
import { ChallengeState, challengeReducer } from './challenge-reducer';

export interface Wallet {
  walletState: WalletState;
  challenge: ChallengeState;
}

export const walletReducer = combineReducers<Wallet>({
  walletState: walletStateReducer,
  challenge: challengeReducer,
});