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

  if (theirPosition.equals(challengePosition) && theirPosition.turnNum < myPosition.turnNum) {
    // We assume that you'd want to respond in the same way
    responseOptions.push(new RespondWithExistingMove({ response: myPosition }));
  }
  if (theirPosition.equals(challengePosition) && theirPosition.turnNum > myPosition.turnNum) {
    // TODO: make sure we sent the move to the app
    responseOptions.push(new RespondWithMove());
  }
  if (!theirPosition.equals(challengePosition) && theirPosition.turnNum === challengePosition.turnNum) {
    responseOptions.push(new RespondWithAlternativeMove({ theirPosition, myPosition }));
  }
  if (theirPosition.turnNum > challengePosition.turnNum) {
    responseOptions.push(new Refute({ theirPosition }));
  }

  yield put(challengeActions.setChallenge(expirationTime, responseOptions, userIsChallenger ? ChallengeStatus.WaitingOnOtherPlayer : ChallengeStatus.WaitingForUserSelection));
  if (userIsChallenger) {
    yield take(blockchainActions.CHALLENGECONCLUDED_EVENT);
    yield put(displayActions.hideWallet());
  } else {
    const action = yield take(challengeActions.SELECT_MOVE_RESPONSE);
    switch (action.type) {
      case challengeActions.SELECT_MOVE_RESPONSE:
        yield put(displayActions.hideWallet());
        // TODO: We want to refactor this so the app is simply letting the wallet know a message is sent.
        const storeMessageAction: externalActions.StoreMessageRequest = yield take(externalActions.STORE_MESSAGE_REQUEST);
        yield put(challengeActions.setChallengeStatus(ChallengeStatus.WaitingForBlockchain));
        yield put(displayActions.showWallet());
        const signature = new Signature(wallet.sign(storeMessageAction.positionData));
        yield put(blockchainActions.respondWithMoveRequest(storeMessageAction.positionData, signature));
        yield take(blockchainActions.CHALLENGECONCLUDED_EVENT);
        yield put(displayActions.hideWallet());
        break;
    }

  }
}