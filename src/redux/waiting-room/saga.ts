import { take, actionChannel, put, call } from 'redux-saga/effects'; 
import { reduxSagaFirebase } from '../../gateways/firebase';
 
import * as waitingRoomActions from '../waiting-room/actions';
import * as messageActions from '../message-service/actions';
import * as applicationActions from '../application/actions';
import GameEngineB from '../../game-engine/GameEngineB';

type ActionType = (
  | waitingRoomActions.CancelChallenge
  | messageActions.MessageReceived
);

export default function * waitingRoomSaga(address, stake, name, isPublic) {
  yield put(applicationActions.waitingRoomSuccess());

  const channel = yield actionChannel([
    waitingRoomActions.CANCEL_CHALLENGE,
    messageActions.MESSAGE_RECEIVED,
  ]);

  const challenge = {
    address,
    name: name,
    stake: stake,
    isPublic: isPublic,
    lastSeen: new Date().getTime(),
  }

  yield call(reduxSagaFirebase.database.create, `/challenges/${address}`, challenge);

  while (true) {
    const action: ActionType = yield take(channel);

    switch (action.type) {
      case waitingRoomActions.CANCEL_CHALLENGE:
        yield call(reduxSagaFirebase.database.delete, `/challenges/${address}`);
        yield put(applicationActions.lobbyRequest());
        break;

      case messageActions.MESSAGE_RECEIVED:
        const gameEngine = GameEngineB.fromProposal(action.message);
        //todo: handle error if it isn't a propose state with the right properties
        yield call(reduxSagaFirebase.database.delete, `/challenges/${address}`);
        yield put(applicationActions.gameRequest(gameEngine));
        break;
    }
  }
}


