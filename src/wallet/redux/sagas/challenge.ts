import { put } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';

export default function* challengeSaga(challenge, myPosition: string) {
  const userIsChallenger = myPosition.toLowerCase() === challenge.state.toLowerCase();

  const expirationTime = 100;
  if (userIsChallenger) {
    yield put(challengeActions.showWaitingScreen(expirationTime));
  } else {
    const responseOptions = [];
    yield put(challengeActions.showResponseScreen(responseOptions, expirationTime));
  }
}