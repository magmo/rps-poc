import WalletChallengeEngine from "../../wallet-engine/WalletChallengeEngine";
import * as stateActions from '../actions/state';
import { put } from "redux-saga/effects";
import * as blockchainActions from '../actions/blockchain';

export function* challengeSaga(yourState, theirState, yourSignature,theirSignature){
  const walletChallengeEngine = WalletChallengeEngine.setupEngine();
  yield put(blockchainActions.createChallenge(yourState, theirState, yourSignature,theirSignature ));
  yield put(stateActions.stateChanged(walletChallengeEngine.state));

}