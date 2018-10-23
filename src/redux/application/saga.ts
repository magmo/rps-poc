import { take, cancel, actionChannel, fork, spawn, race, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import * as applicationActions from './actions';

import { walletSaga, actions as walletActions } from '../../wallet';
import * as gameActions from '../game/actions';
import messageServiceSaga from '../message-service/saga';
import lobbySaga from '../lobby/saga';
import waitingRoomSaga from '../waiting-room/saga';

export default function* applicationControllerSaga(userId: string, userName:string) {
  yield put(gameActions.enterLobby(userName));
  const { address, error } = yield call(setupWallet, userId);

  if (error) {
    yield put(applicationActions.initializationFailure(error));
    yield take(applicationActions.RELOAD);
  }

  yield fork(messageServiceSaga, address);
  yield fork(lobbySaga,address);
  yield fork(waitingRoomSaga,address,userName,true);


}

function* setupWallet(uid) {
  const channel = yield actionChannel(walletActions.INITIALIZATION_SUCCESS);

  const task = yield spawn(walletSaga, uid);

  const { success, failure } = yield race({
    success: take(channel),
    failure: call(delay, 2000),
  });

  if (failure) {
    const error = 'Wallet initialization timed out';
    yield put(walletActions.initializationFailure(error));
    yield cancel(task);
    return { error };
  } else {
    const address = (success as walletActions.InitializationSuccess).address;

    return { address, task };
  }
}

