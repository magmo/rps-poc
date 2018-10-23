import { take, actionChannel, put, call, apply } from 'redux-saga/effects';
import { default as firebase, reduxSagaFirebase } from '../../gateways/firebase';

import * as waitingRoomActions from '../waiting-room/actions';

import * as gameActions from '../game/actions';
type ActionType = waitingRoomActions.CancelChallenge | gameActions.PositionReceived | gameActions.EnterWaitingRoom;
   
export default function* waitingRoomSaga(
  address: string,
  name: string,
  isPublic: boolean,
) {
  const channel = yield actionChannel([
    waitingRoomActions.CANCEL_CHALLENGE,
    gameActions.POSITION_RECEIVED,
    gameActions.ENTER_WAITING_ROOM,
  ]);

  const challengeKey = `/challenges/${address}`;

  while (true) {
    const action: ActionType = yield take(channel);

    switch (action.type) {
      case gameActions.ENTER_WAITING_ROOM:
        const commonChallengeProps = {
          address,
          name,
          isPublic,
          createdAt: new Date().getTime(),
        };

        const serializedChallenge = {
          ...commonChallengeProps,
          stake: action.roundBuyIn.toString(),
        };

        const disconnect = firebase.database().ref(challengeKey).onDisconnect();
        yield apply(disconnect, disconnect.remove);
        // use update to allow us to pick our own key
        yield call(reduxSagaFirebase.database.update, challengeKey, serializedChallenge);
        break;
      case waitingRoomActions.CANCEL_CHALLENGE:
        yield call(reduxSagaFirebase.database.delete, challengeKey);
        yield put(gameActions.enterLobby(name));
        break;

      case gameActions.POSITION_RECEIVED:
        // todo: handle error if it isn't a propose state with the right properties
        yield call(reduxSagaFirebase.database.delete, challengeKey);
        break;
    }
  }
}
