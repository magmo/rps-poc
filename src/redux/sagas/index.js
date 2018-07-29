import { delay } from 'redux-saga';
import {
  put, takeEvery, select, fork,
} from 'redux-saga/effects';
import { types as playerAStates } from '../../game-engine/application-states/ApplicationStatesPlayerA';
import { messageReceived, eventReceived, messageSent } from '../actions/game';
import opponentSaga from './opponents';
import loginSaga from './login';
import { getApplicationState } from '../store';

function* opponentResponseFaker() {
  yield delay(2000);
  yield put(messageReceived('blah'));
}

function* messageSender() {
  const state = yield select(getApplicationState);
  if (state.shouldSendMessage) {
    yield delay(2000); // for dev purposes
    yield put(messageSent(state.message));
    // todo put the message sending logic here
    yield opponentResponseFaker();
  }
}

function* blockchainResponseFaker() {
  const state = yield select(getApplicationState);
  if (state.type === playerAStates.WaitForBlockchainDeploy
      || state.type === playerAStates.WaitForBToDeposit) {
    yield delay(2000);
    yield put(eventReceived('blah'));
  }
}

export default function* rootSaga() {
  yield fork(opponentSaga);
  yield fork(loginSaga);
  yield takeEvery('*', blockchainResponseFaker);
  yield takeEvery('*', messageSender);
}
