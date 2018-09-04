import * as blockchainActions from '../actions/blockchain';
import { put, take } from 'redux-saga/effects';
import { WaitForFunding as WaitForFundingA } from '../../../game-engine/application-states/PlayerA';
import { WaitForFunding as WaitForFundingB } from '../../../game-engine/application-states/PlayerB';

import { WalletStateActions } from '../actions/state';
import * as walletExternalActions from '../actions/external';
import * as WalletEngine from '../../wallet-engine/WalletEngine';

export function* fundingSaga(channelId: string, state: WaitForFundingA | WaitForFundingB) {
  
  // if state.sendToBlockchain

  // if state send to player
  
  const walletEngine = WalletEngine.setupWalletEngine(state.playerIndex);
  if (state.playerIndex === 0) {
    
    let newState = walletEngine.approve();
   
    yield put(blockchainActions.deploymentRequest(channelId, state.stake));
    newState = walletEngine.transactionSent();

    yield put(WalletStateActions.stateChanged(newState));
    
    const deploySuceededAction = yield take(blockchainActions.DEPLOY_SUCCESS);
    yield put(walletExternalActions.sendMessage(deploySuceededAction.address));

    walletEngine.transactionConfirmed(deploySuceededAction.address);

  } else if (state.player === 1) {
    
    let newState = walletEngine.approve();
    yield put(WalletStateActions.stateChanged(newState));
    const action = yield take(walletExternalActions.RECEIVE_MESSAGE);
    newState = walletEngine.transactionConfirmed(action.data);
    yield put(WalletStateActions.stateChanged(newState));
    yield put(blockchainActions.depositRequest(newState.adjudicator, state.stake));
    yield take(blockchainActions.DEPOSIT_SUCCESS);
    walletEngine.transactionConfirmed("");
    yield put(WalletStateActions.stateChanged(newState));
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
