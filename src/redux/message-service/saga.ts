import { fork, take, call, put, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import { reduxSagaFirebase } from '../../gateways/firebase';

import * as messageActions from './actions';
import * as autoOpponentActions from '../auto-opponent/actions';

function * sendMessagesSaga(address: string, autoOpponentAddress: string) {
  const channel = yield actionChannel(messageActions.SEND_MESSAGE);

  while (true) {
    const action: messageActions.SendMessage = yield take(channel); 

    const { to, data } = action;

    if (to === autoOpponentAddress) {
      yield put(autoOpponentActions.messageFromApp(data))
    } else {
      yield call(reduxSagaFirebase.database.create, `/messages/${to}`, data);
    }
  }
}

function * receiveFromFirebaseSaga(address: string) {
  const channel = yield call(
    reduxSagaFirebase.database.channel,
    `/messages/${address}`,
    'child_added',
    buffers.fixed(10),
  );

  while(true) {
    const message = yield take(channel);
    const key = message.snapshot.key;

    yield put(messageActions.messageReceived(message.value));
    yield call(reduxSagaFirebase.database.delete, `/messages/${address}/${key}`);
  }
}

function * receiveFromAutoOpponentSaga() {
  const channel = yield actionChannel(autoOpponentActions.MESSAGE_TO_APP);

  while(true) {
    const action: autoOpponentActions.MessageToApp = yield take(channel);
    yield put(messageActions.messageReceived(action.data));
  }

}

export default function * messageSaga(address: string, autoOpponentAddress: string) {
  yield fork(sendMessagesSaga, address, autoOpponentAddress);
  yield fork(receiveFromFirebaseSaga, address);
  yield fork(receiveFromAutoOpponentSaga, address);
}
