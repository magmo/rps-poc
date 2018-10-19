import { combineReducers } from 'redux';

import { applicationReducer, ApplicationState } from './application/reducer';
import { loginReducer, LoginState } from './login/reducer';
import { MetamaskState, metamaskReducer } from './metamask/reducer';
import { walletReducer, Wallet } from '../wallet/redux/reducers/wallet';
import { gameReducer, JointState } from './game/reducer';

export interface SiteState {
  app: ApplicationState;
  login: LoginState;
  wallet: Wallet;
  metamask: MetamaskState;
  game: JointState;
}

export default combineReducers<SiteState>({
  app: applicationReducer,
  login: loginReducer,
  wallet: walletReducer,
  metamask: metamaskReducer,
  game: gameReducer,
});