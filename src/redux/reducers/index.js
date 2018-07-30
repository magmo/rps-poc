import { combineReducers } from 'redux';

import game from './game';
import opponents from './opponents';
import login from './login';

export default combineReducers({
  game,
  opponents,
  login,
});

export const getApplicationState = storeObj => storeObj.game;
export const getWallet = storeObj => storeObj.login.wallet;
export const getAddress = storeObj => storeObj.login.wallet.address;
export const getUser = storeObj => storeObj.login.user;
