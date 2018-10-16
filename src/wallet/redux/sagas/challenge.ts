import { put } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';
import decode from "../../domain/decode";
import { Refute, ChallengeResponse, RespondWithMove, RespondWithAlternativeMove } from "../../domain/ChallengeResponse";

export default function* challengeSaga(challenge, theirPositionString: string, myPositionString: string) {
  const expirationTime = 100;
  const responseOptions: ChallengeResponse[] = [];

  const myPosition = decode(myPositionString);
  const theirPosition = decode(theirPositionString);
  const challengePosition = decode(challenge.state);

  const userIsChallenger = myPosition.mover.toLowerCase() === challengePosition.mover.toLowerCase();

  if (theirPosition.equals(challengePosition) && theirPosition.turnNum < myPosition.turnNum) {
    // We assume that you'd want to respond in the same way
    responseOptions.push(new RespondWithMove({ response: myPosition }));
  }
  if (theirPosition.equals(challengePosition) && theirPosition.turnNum > myPosition.turnNum) {
    // TODO: make sure we sent the move to the app
    responseOptions.push(new RespondWithMove({}));
  }
  if (!theirPosition.equals(challengePosition) && theirPosition.turnNum === challengePosition.turnNum) {
    responseOptions.push(new RespondWithAlternativeMove({ theirPosition, myPosition }));
  }
  if (theirPosition.turnNum > challengePosition.turnNum) {
    responseOptions.push(new Refute({ theirPosition }));
  }

  yield put(challengeActions.setChallenge(expirationTime, responseOptions, userIsChallenger));
}