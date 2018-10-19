import { take, cancel, actionChannel, fork, spawn, race, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import * as applicationActions from './actions';

import { walletSaga, actions as walletActions } from '../../wallet';

import waitingRoomSaga from '../waiting-room/saga';
import lobbySaga from '../lobby/saga';
import messageServiceSaga from '../message-service/saga';

export default function* applicationControllerSaga(userId: string) {

  const { address, error } = yield call(setupWallet, userId);

 

  if (error) {
    yield put(applicationActions.initializationFailure(error));
    yield take(applicationActions.RELOAD);
  }

  yield fork(messageServiceSaga, address);

  const channel = yield actionChannel([
    applicationActions.LOBBY_REQUEST,
    applicationActions.WAITING_ROOM_REQUEST,
    applicationActions.GAME_REQUEST,
    applicationActions.INITIALIZATION_FAILURE,
  ]);
  let currentRoom = yield fork(lobbySaga, address);

  while (true) {
    const action: applicationActions.AnyAction = yield take(channel);
    yield cancel(currentRoom); // todo: maybe we should do some checks first

    switch (action.type) {
      case applicationActions.LOBBY_REQUEST:
        currentRoom = yield fork(lobbySaga, address);
        break;
      case applicationActions.WAITING_ROOM_REQUEST:
        const isPublic = true;
        currentRoom = yield fork(waitingRoomSaga, address, action.name, action.stake, isPublic);
        break;
      default:
        // todo: check for unreachability
    }
  }
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

