import { take, actionChannel, put, call, apply } from 'redux-saga/effects';
import { default as firebase, reduxSagaFirebase } from '../../gateways/firebase';

import * as waitingRoomActions from '../waiting-room/actions';
import * as applicationActions from '../application/actions';

import BN from 'bn.js';
import * as gameActions from '../game/actions';

type ActionType = waitingRoomActions.CancelChallenge | gameActions.PositionReceived;

export default function* waitingRoomSaga(
  address: string,
  name: string,
  stake: BN,
  isPublic: boolean,
) {
  const channel = yield actionChannel([
    waitingRoomActions.CANCEL_CHALLENGE,
    gameActions.POSITION_RECEIVED
  ]);

  const commonChallengeProps = {
    address,
    name,
    isPublic,
    createdAt: new Date().getTime(),
  };

  const challengeKey = `/challenges/${address}`;

  yield put(applicationActions.waitingRoomSuccess({ ...commonChallengeProps, stake }));
  const serializedChallenge = {
    ...commonChallengeProps,
    stake: stake.toString(),
  };
  
  const disconnect = firebase.database().ref(challengeKey).onDisconnect();
  yield apply(disconnect, disconnect.remove);
  // use update to allow us to pick our own key
  yield call(reduxSagaFirebase.database.update, challengeKey, serializedChallenge);

  while (true) {
    const action: ActionType = yield take(channel);

    switch (action.type) {
      case waitingRoomActions.CANCEL_CHALLENGE:
        yield call(reduxSagaFirebase.database.delete, challengeKey);
        yield put(gameActions.returnToLobby());
        break;

      case gameActions.POSITION_RECEIVED:
        // todo: handle error if it isn't a propose state with the right properties
        yield call(reduxSagaFirebase.database.delete, challengeKey);
        break;
    }
  }
}
