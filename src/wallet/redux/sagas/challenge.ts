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

  if (theirPosition.equals(challengePosition)) {
    if (theirPosition.turnNum < myPosition.turnNum) {
      // Assume the user would respond in the same way.
      responseOptions.push(new RespondWithMove({ response: myPosition }));
    } else {
      responseOptions.push(new RespondWithMove({}));
    }
  }

  if (!theirPosition.equals(challengePosition)) {
    if (theirPosition.turnNum >= challengePosition.turnNum) {
      responseOptions.push(new RespondWithAlternativeMove({ theirPosition, myPosition }));
    }
    if (theirPosition.turnNum > challengePosition.turnNum) {
      responseOptions.push(new Refute({ theirPosition }));
    }
    if (challengePosition.turnNum > myPosition.turnNum) {
      yield put(challengeActions.sendChallengePosition(challenge.state));
      responseOptions.push(new RespondWithMove({}));
    }
  }


  yield put(challengeActions.setChallenge(expirationTime, responseOptions, userIsChallenger));
}