import { take, actionChannel, put, call, fork } from 'redux-saga/effects';
import { default as firebase, reduxSagaFirebase } from '../../gateways/firebase';

import * as waitingRoomActions from '../waiting-room/actions';
import * as messageActions from '../message-service/actions';
import * as applicationActions from '../application/actions';
import GameEngineB from '../../game-engine/GameEngineB';
import decode from '../../game-engine/positions/decode';
import { delay } from 'redux-saga';
import BN from 'bn.js';
type ActionType = waitingRoomActions.CancelChallenge | messageActions.MessageReceived;

const REFRESH_INTERVAL = 4000; // milliseconds
const EXPIRATION_INTERVAL = 5000; // milliseconds

export default function* waitingRoomSaga(
  address: string,
  name: string,
  stake: BN,
  isPublic: boolean,
) {
  const channel = yield actionChannel([
    waitingRoomActions.CANCEL_CHALLENGE,
    messageActions.MESSAGE_RECEIVED,
  ]);

  const commonChallengeProps = {
    address,
    name,
    isPublic,
    lastSeen: new Date().getTime(),
  };

  yield put(applicationActions.waitingRoomSuccess({ ...commonChallengeProps, stake }));
  const serializedChallenge = {
    ...commonChallengeProps,
    stake: stake.toString(),
  };
  // use update to allow us to pick our own key
  yield call(reduxSagaFirebase.database.update, `/challenges/${address}`, serializedChallenge);

  yield fork(challengeHeartbeatSaga, {
    ...commonChallengeProps,
    expiresAt: new Date().getTime() + EXPIRATION_INTERVAL,
    stake,
  });

  while (true) {
    const action: ActionType = yield take(channel);

    switch (action.type) {
      case waitingRoomActions.CANCEL_CHALLENGE:
        yield call(reduxSagaFirebase.database.delete, `/challenges/${address}`);
        yield put(applicationActions.lobbyRequest());
        break;

      case messageActions.MESSAGE_RECEIVED:
        const position = decode(action.message);
        const gameEngine = GameEngineB.fromProposal(position);
        // todo: handle error if it isn't a propose state with the right properties
        yield call(reduxSagaFirebase.database.delete, `/challenges/${address}`);
        yield put(applicationActions.gameRequest(gameEngine));
        break;
    }
  }
}

function* challengeHeartbeatSaga(challenge) {
  while (true) {
    yield call(delay, REFRESH_INTERVAL);
    yield refreshChallenge(challenge);
  }
}

const challengeRef = challenge => {
  return firebase.database().ref(`challenges/${challenge.address}`);
};

function* refreshChallenge(challenge) {
  const challengeParams = {
    expiresAt: new Date().getTime() + EXPIRATION_INTERVAL,
  };

  return yield call(reduxSagaFirebase.database.patch, challengeRef(challenge), challengeParams);
}
