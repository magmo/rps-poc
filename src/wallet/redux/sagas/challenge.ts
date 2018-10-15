import { put } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';
import { ResponseOption } from '../actions/challenge';

export default function* challengeSaga(challenge, myState: string) {
  const userIsChallenger = myState.toLowerCase() === challenge.state.toLowerCase();

  const expirationTime = 100;
  if (userIsChallenger) {
    yield put(challengeActions.setChallenge(expirationTime,[],userIsChallenger));
  } else {
    yield put(challengeActions.setChallenge(expirationTime,[ResponseOption.RespondWithMove],userIsChallenger));
  }
}