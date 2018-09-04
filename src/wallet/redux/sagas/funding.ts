import * as blockchainActions from '../actions/blockchain';
import { put, take } from 'redux-saga/effects';
import { WaitForFunding as WaitForFundingA } from '../../../game-engine/application-states/PlayerA';
import { WaitForFunding as WaitForFundingB } from '../../../game-engine/application-states/PlayerB';
import { Player } from '../../../game-engine/application-states';

import { WalletStateActions } from '../actions/state';
import * as walletExternalActions from '../actions/external'
import WalletEngineA from '../../wallet-engine/WalletEngineA';
import WalletEngineB from '../../wallet-engine/WalletEngineB';


export function* fundingSaga(channelId: string, state: WaitForFundingA | WaitForFundingB) {
  // todo:
  // - check that we already have both prefundsetup states for that channel
  // - determine the player and the amounts from the prefund setup states
  if (state.player === Player.PlayerA) {
    const walletEngine = WalletEngineA.setupWalletEngine();
    let newState = walletEngine.approve();
    yield put(blockchainActions.deploymentRequest(channelId, state.stake));
    newState = walletEngine.transactionSent();
    yield put(WalletStateActions.stateChanged(newState));
    const deploySuceededAction = yield take(blockchainActions.DEPLOY_SUCCESS);
    yield put(walletExternalActions.sendMessage(deploySuceededAction.adjudicator));
    walletEngine.deployed(deploySuceededAction.address);

  }
  else if (state.player === Player.PlayerB){
    const walletEngine = WalletEngineB.setupWalletEngine();
    let newState = walletEngine.approve();
    yield put(WalletStateActions.stateChanged(newState));
    const action  = yield take(walletExternalActions.RECEIVE_MESSAGE);
    newState = walletEngine.deployed(action.data);
    yield put(WalletStateActions.stateChanged(newState));
    yield put (blockchainActions.depositRequest(newState.adjudicator, state.stake));
    
  }
  // - update state to display confirmation screen to user
  // - wait for user's response
  // - if player a
  //   - send transaction to blockchain
  //   - update state to display "waiting for deploy"
  //   - wait for confirmation
  //   - send adjudicator address to opponent
  //   - update state to display "waiting for deposit"
  //   - wait for opponent to deposit / blockchain confirmation
  //   - update state to display the success screen
  //   - wait for user to click "return-to-app"

  return true;
}
