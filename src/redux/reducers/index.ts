import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle'


import { gameReducer, GameState } from './game';
import { opponentReducer, OpponentState } from './opponents';
import { loginReducer, LoginState } from './login';

export interface ApplicationState {
  game: GameState,
  opponents: OpponentState,
  login: LoginState,
};

export default combineReducers<ApplicationState>({
  game: gameReducer,
  opponents: opponentReducer,
  login: loginReducer,
  ...drizzleReducers,
});
