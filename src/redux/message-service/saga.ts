import { fork, take, call, put, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import { reduxSagaFirebase } from '../../gateways/firebase';

import * as messageActions from './actions';
import * as autoOpponentActions from '../auto-opponent/actions';
import { actions as walletActions } from '../../wallet';
import { AUTO_OPPONENT_ADDRESS } from '../../constants';
import { SignatureSuccess } from '../../wallet/redux/actions/external';
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
      const requestId = hash(`${data}${Date.now()}`);

      yield put(walletActions.signatureRequest(requestId, data));
      // TODO: Handle signature failure
      let signatureCompleteAction: SignatureSuccess = yield take(walletActions.SIGNATURE_SUCCESS);
      while (signatureCompleteAction.requestId !== requestId) {
        signatureCompleteAction = yield take(walletActions.SIGNATURE_SUCCESS);
      }
      queue = Queue.GAME_ENGINE;
      message = { data, queue, signature: signatureCompleteAction.signature };
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
      yield put(messageActions.messageReceived(data));
    } else {
      yield put(walletActions.receiveMessage(data));
    }
    yield call(reduxSagaFirebase.database.delete, `/messages/${address}/${key}`);
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
