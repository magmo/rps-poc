import { delay } from 'redux-saga';
import {
  put, takeEvery, select, fork,
} from 'redux-saga/effects';
import * as playerAStates from '../../game-engine/application-states/PlayerA';
import { GameActionType } from '../actions/game';
import opponentSaga from './opponents';
import loginSaga from './login';
import messageSaga from './messages';
import { getApplicationState } from '../store';
import autoOpponentSaga from './auto-opponent';
import { walletSaga } from '../../wallet/sagas/wallet';
import { BlockchainAction } from '../../wallet/actions/blockchain';
import walletControllerSaga from '../../wallet/sagas/wallet-controller';

function* blockchainResponseFaker() {
  const state = yield select(getApplicationState);
  if (state == null) { return false; }
  if (state instanceof playerAStates.WaitForFunding) {
    yield delay(2000);
    yield put(BlockchainAction.receiveEvent({adjucator:"FakeAddress"}));
  }
}

export default function* rootSaga() {
  yield fork(opponentSaga);
  yield fork(walletSaga);
  yield fork(walletControllerSaga);
  yield fork(loginSaga);
  yield fork(messageSaga);  
  yield fork(autoOpponentSaga);
  yield takeEvery(GameActionType.STATE_CHANGED, blockchainResponseFaker);
}
