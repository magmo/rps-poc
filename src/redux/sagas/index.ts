import {
  fork, all,
} from 'redux-saga/effects';
import opponentSaga from './opponents';
import loginSaga from './login';
import messageSaga from './messages';
import autoOpponentSaga from './auto-opponent';
import { drizzleSagas } from 'drizzle';



export default function* rootSaga() {
  yield all(drizzleSagas.map(saga => fork(saga)));
  yield fork(opponentSaga);
  yield fork(loginSaga);
  yield fork(messageSaga);  
  yield fork(autoOpponentSaga);
}
