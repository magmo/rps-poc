import { combineReducers } from 'redux';

import { applicationReducer, ApplicationState } from './application/reducer';
import { loginReducer, LoginState } from './login/reducer';
import { MetamaskState, metamaskReducer } from './metamask/reducer';
import { walletReducer, Wallet as WalletState } from '../wallet/redux/reducers/wallet';
import { gameReducer, State as GameState } from './game/reducer';

export interface SiteState {
  app: ApplicationState;
  login: LoginState;
  wallet: WalletState;
  metamask: MetamaskState;
  game: GameState;
}

export default combineReducers<SiteState>({
  app: applicationReducer,
  login: loginReducer,
  wallet: walletReducer,
  metamask: metamaskReducer,
  game: gameReducer,
});