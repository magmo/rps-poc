import { delay } from 'redux-saga';
import { types as playerAStates } from '../../game-engine/application-states/ApplicationStatesPlayerA';
import { call, put, takeEvery, select, fork } from 'redux-saga/effects';
import { authProvider, reduxSagaFirebase } from '../../gateways/firebase';
import { types, loginSuccess, messageReceived, eventReceived, messageSent } from '../actions';
import opponentSaga from './opponents';

function* messageSender() {
  let state = yield select();
  if (state.shouldSendMessage) {
    yield delay(2000);  // for dev purposes
    yield put(messageSent(state.message));
    // todo put the message sending logic here
    yield opponentResponseFaker();
  }
}

function* loginSaga() {
  try {
    const loginData = yield call(reduxSagaFirebase.auth.signInWithPopup, authProvider);
    yield put(loginSuccess(loginData));
  } catch (error) {
    console.log('User auth failed');
  }
}

function* opponentResponseFaker() {
  yield delay(2000);
  yield put(messageReceived("blah"));
}


function* blockchainResponseFaker() {
  let state = yield select();
  if (state.type === playerAStates.WaitForBlockchainDeploy || state.type === playerAStates.WaitForBToDeposit) {
    yield delay(2000);
    yield put(eventReceived("blah"));
  }
}

export default function* rootSaga() {
  yield fork(opponentSaga);
  yield takeEvery('*', blockchainResponseFaker);
  yield takeEvery('*', messageSender);
  yield takeEvery(types.LOGIN_USER, loginSaga);
}
