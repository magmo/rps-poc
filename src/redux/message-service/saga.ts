import { fork, take, call, put, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import { reduxSagaFirebase } from '../../gateways/firebase';

import * as messageActions from './actions';
import * as autoOpponentActions from '../auto-opponent/actions';
import { actions as walletActions } from '../../wallet';
import { AUTO_OPPONENT_ADDRESS } from '../../constants';
import { SignatureResponse } from '../../wallet/redux/actions/external';
import hash from 'object-hash';
export enum Queue {
  WALLET = 'WALLET',
  GAME_ENGINE = 'GAME_ENGINE',
}

function* sendMessagesSaga() {
  const channel = yield actionChannel([messageActions.SEND_MESSAGE, walletActions.SEND_MESSAGE]);

  while (true) {
    const action: messageActions.SendMessage | walletActions.SendMessage = yield take(channel);

    const { to, data } = action;
    let message = {};
    let queue;
    if (action.type === messageActions.SEND_MESSAGE) {
      queue = Queue.GAME_ENGINE;
      const signature = yield signMessage(data);
      message = { data, queue, signature };
    } else {
      queue = Queue.WALLET;
      message = { data, queue };
    }

    if (to === AUTO_OPPONENT_ADDRESS) {
      yield put(autoOpponentActions.messageFromApp(data));
    } else {
      yield call(reduxSagaFirebase.database.create, `/messages/${to}`, message);
    }
  }
}

function* receiveFromFirebaseSaga(address: string) {
  const channel = yield call(
    reduxSagaFirebase.database.channel,
    `/messages/${address}`,
    'child_added',
    buffers.fixed(10),
  );

  while (true) {
    const message = yield take(channel);
    const key = message.snapshot.key;

    const { data, queue } = message.value;

    if (queue === Queue.GAME_ENGINE) {
      const { signature } = message.value;
      const validMessage = yield validateMessage(data, signature, address);
      if (!validMessage) {
        // TODO: Handle this
      }
      yield put(messageActions.messageReceived(data));
    } else {
      yield put(walletActions.receiveMessage(data));
    }
    yield call(reduxSagaFirebase.database.delete, `/messages/${address}/${key}`);
  }
}

function* validateMessage(data, signature, address) {
  const requestId = hash(data + Date.now());
  yield put(walletActions.validationRequest(requestId, data, signature, address));
  const actionFilter = [walletActions.VALIDATION_SUCCESS, walletActions.VALIDATION_FAILURE];
  let action: walletActions.ValidationResponse = yield take(actionFilter);
  while (action.requestId !== requestId) {
    action = yield take(actionFilter);
  }
  if (action.type === walletActions.VALIDATION_SUCCESS) {
    return true;
  } else {
    return false;
  }
}

function* signMessage(data) {
  const requestId = hash(`${data}${Date.now()}`);

  yield put(walletActions.signatureRequest(requestId, data));
  // TODO: Handle signature failure
  const actionFilter = [walletActions.SIGNATURE_SUCCESS, walletActions.SIGNATURE_FAILURE];
  let signatureResponse: SignatureResponse = yield take(actionFilter);
  while (signatureResponse.requestId !== requestId) {
    signatureResponse = yield take(actionFilter);
  }
  if (signatureResponse.type === walletActions.SIGNATURE_SUCCESS) {
    return signatureResponse.signature;
  } else {
    // TODO: Handle this
  }
}

function* receiveFromAutoOpponentSaga() {
  const channel = yield actionChannel(autoOpponentActions.MESSAGE_TO_APP);

  while (true) {
    const action: autoOpponentActions.MessageToApp = yield take(channel);
    yield put(messageActions.messageReceived(action.data));
  }
}

export default function* messageSaga(address: string) {
  yield fork(sendMessagesSaga);
  yield fork(receiveFromFirebaseSaga, address);
  yield fork(receiveFromAutoOpponentSaga);
}
