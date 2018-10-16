import { put, take } from "redux-saga/effects";

import * as challengeActions from '../actions/challenge';
import * as displayActions from '../actions/display';
import * as externalActions from '../actions/external';
import * as blockchainActions from '../actions/blockchain';

import decode from "../../domain/decode";
import { Refute, ChallengeResponse, RespondWithMove, RespondWithAlternativeMove, RespondWithExistingMove } from "../../domain/ChallengeResponse";
import ChannelWallet from "src/wallet/domain/ChannelWallet";
import { Signature } from "src/wallet/domain/Signature";
import { ChallengeStatus } from '../actions/challenge';

export default function* challengeSaga(wallet: ChannelWallet, challenge, theirPositionString: string, myPositionString: string) {
  const { expirationTime } = challenge;
  const myPosition = decode(myPositionString);
  const theirPosition = decode(theirPositionString);
  const challengePosition = decode(challenge.state);
  const responseOptions: ChallengeResponse[] = [];

  const userIsChallenger = myPosition.mover.toLowerCase() === challengePosition.mover.toLowerCase();

  if (theirPosition.equals(challengePosition)) {
    if (theirPosition.turnNum < myPosition.turnNum) {
      // Assume the user would respond in the same way.
      responseOptions.push(new RespondWithExistingMove({ response: myPosition }));
    } else {
      responseOptions.push(new RespondWithMove());
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
      responseOptions.push(new RespondWithMove());
    }
  }

  yield put(challengeActions.setChallenge(expirationTime, responseOptions, userIsChallenger ? ChallengeStatus.WaitingOnOtherPlayer : ChallengeStatus.WaitingForUserSelection));
  yield put(displayActions.showWallet());

  if (userIsChallenger) {
    yield take(blockchainActions.CHALLENGECONCLUDED_EVENT);
    yield put(displayActions.hideWallet());
  } else {
    const action = yield take(challengeActions.SELECT_MOVE_RESPONSE);
    switch (action.type) {
      case challengeActions.SELECT_MOVE_RESPONSE:
        yield selectMove(wallet);
      default:
        yield put(displayActions.hideWallet());
        break;
    }
  }
}

function* selectMove(wallet: ChannelWallet) {
  // TODO: We want to refactor this so the app is simply letting the wallet know a message is sent.
  const storeMessageAction: externalActions.StoreMessageRequest = yield take(externalActions.STORE_MESSAGE_REQUEST);
  yield put(challengeActions.setChallengeStatus(ChallengeStatus.WaitingForBlockchain));

  const signature = new Signature(wallet.sign(storeMessageAction.positionData));
  yield put(blockchainActions.respondWithMoveRequest(storeMessageAction.positionData, signature));

  yield take(blockchainActions.CHALLENGECONCLUDED_EVENT);
}