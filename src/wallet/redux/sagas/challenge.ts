import { put } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';
import { ResponseOption } from '../actions/challenge';

export default function* challengeSaga(challenge, myState: string) {
  const userIsChallenger = myState.toLowerCase() === challenge.state.toLowerCase();

  const expirationTime = 100;
  if (userIsChallenger) {
    yield put(challengeActions.showWaitingScreen(expirationTime));
  } else {
    yield put(challengeActions.showResponseScreen([ResponseOption.RespondWithMove], expirationTime));
  }
}