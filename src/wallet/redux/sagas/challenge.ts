import { put } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';
import decode from "../../domain/decode";
import { Refute, ChallengeResponse, RespondWithMove, RespondWithAlternativeMove } from "../../domain/ChallengeResponse";

export default function* challengeSaga(challenge, theirPositionString: string, myPositionString: string) {
  const userIsChallenger = myPositionString.toLowerCase() === challenge.state.toLowerCase();

  const expirationTime = 100;
  if (userIsChallenger) {
    yield put(challengeActions.showWaitingScreen(expirationTime));
  } else {
    const responseOptions: ChallengeResponse[] = [];

    const myPosition = decode(myPositionString);
    const theirPosition = decode(theirPositionString);
    const challengePosition = decode(challenge.state);


    if (theirPosition === challengePosition && theirPosition.turnNum < myPosition.turnNum) {
      // We assume that you'd want to respond in the same way
      responseOptions.push(new RespondWithMove({ response: myPosition }));
    }
    if (theirPosition === challengePosition && theirPosition.turnNum > myPosition.turnNum) {
      responseOptions.push(new RespondWithMove({}));
    }
    if (theirPosition.turnNum === challengePosition.turnNum && theirPosition !== challengePosition) {
      responseOptions.push(new RespondWithAlternativeMove({ theirPosition, myPosition }));
    }
    if (theirPosition.turnNum > challengePosition.turnNum) {
      responseOptions.push(new Refute({ theirPosition }));
    }
    
    yield put(challengeActions.showResponseScreen(responseOptions, expirationTime));
  }
}