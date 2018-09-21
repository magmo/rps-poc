import { actionChannel, take, put, fork, call, } from 'redux-saga/effects';

import { initializeWallet } from './initialization';
import * as actions from '../actions/external';
import * as blockchainActions from '../actions/blockchain';
import ChannelWallet from '../../domain/ChannelWallet';
import { fundingSaga } from './funding';
import { blockchainSaga } from './blockchain';
import { AUTO_OPPONENT_ADDRESS } from '../../../constants';
import decode from '../../domain/decode';
import { State } from 'fmg-core';
import { default as firebase, reduxSagaFirebase, serverTimestamp } from '../../../gateways/firebase';
import { ConclusionProof } from '../../domain/ConclusionProof';

export function* walletSaga(uid: string): IterableIterator<any> {
  const wallet = (yield initializeWallet(uid)) as ChannelWallet;
  yield fork(blockchainSaga);

  const channel = yield actionChannel([
    actions.FUNDING_REQUEST,
    actions.SIGNATURE_REQUEST,
    actions.VALIDATION_REQUEST,
    actions.WITHDRAWAL_REQUEST
  ]);

  yield put(actions.initializationSuccess(wallet.address));

  while (true) {
    const action: actions.RequestAction = yield take(channel);

    // The handlers below will block, so the wallet will only ever
    // process one action at a time from the queue.
    switch (action.type) {
      case actions.SIGNATURE_REQUEST:
        yield handleSignatureRequest(wallet, action.requestId, action.positionData);
        break;

      case actions.VALIDATION_REQUEST:
        yield handleValidationRequest(
          wallet,
          action.requestId,
          action.positionData,
          action.signature,
          action.opponentIndex,
        );
        break;

      case actions.FUNDING_REQUEST:
        yield fork(handleFundingRequest, wallet, action.channelId, action.state);
        break;

      case actions.WITHDRAWAL_REQUEST:
        const { state } = action;
        yield handleWithdrawalRequest(wallet, state.position);
        break;

      default:
      // const _exhaustiveCheck: never = action;
      // todo: get this to work
      // currently causes a 'noUnusedLocals' error on compilation
      // underscored variables should be an exception but there seems to
      // be a bug in my current version of typescript
      // https://github.com/Microsoft/TypeScript/issues/15053
    }
  }
}

function* handleSignatureRequest(wallet: ChannelWallet, requestId, positionData) {
  // TODO: Validate transition
  const position = decode(positionData);
  const signature = wallet.sign(position);
  yield storeLastSentState(wallet, position, signature);
  yield put(actions.signatureSuccess(requestId, signature));
}

function* storeLastSentState(
  wallet: ChannelWallet, state: State, signature: string
) {
  yield call(
    reduxSagaFirebase.database.update,
    `wallets/${wallet.id}/channels/${state.channel.id}/sent`,
    { state: state.toHex(), signature, updatedAt: serverTimestamp }
  );

}

function* storeLastReceivedState(wallet: ChannelWallet, state: State, signature: string) {

  yield call(reduxSagaFirebase.database.update,
    `wallets/${wallet.id}/channels/${state.channel.id}/received`,
    { state: state.toHex(), signature, updatedAt: serverTimestamp });
}

function* handleValidationRequest(
  wallet: ChannelWallet,
  requestId,
  data: string,
  signature: string,
  opponentIndex,
) {

  const address = wallet.recover(data, signature);
  const state = decode(data);
  yield storeLastReceivedState(wallet, state, signature);
  if (state.channel.participants[opponentIndex] !== address) {
    yield put(actions.validationFailure(requestId, 'INVALID SIGNATURE'));
  }
  // todo:
  // - validate the transition
  // - store the position

  yield put(actions.validationSuccess(requestId));
}

function* handleFundingRequest(_wallet: ChannelWallet, channelId, state) {
  let success;
  if (state.opponentAddress === AUTO_OPPONENT_ADDRESS) {
    success = true;
  } else {
    success = yield fundingSaga(channelId, state);
  }

  if (success) {
    yield put(actions.fundingSuccess(channelId));
  } else {
    yield put(actions.fundingFailure(channelId, 'Something went wrong'));
  }
  return true;
}

export function* handleWithdrawalRequest(
  wallet: ChannelWallet,
  state: State,
) {
  const { address: playerAddress } = wallet;

  const proof = yield call(loadConclusionProof, wallet, state);

  yield put(blockchainActions.withdrawRequest(playerAddress, proof));
  const { transaction, reason: failureReason } = yield take([
    blockchainActions.WITHDRAW_SUCCESS,
    blockchainActions.WITHDRAW_FAILURE
  ]);

  if (transaction) {
    // TODO: broadcast the channelId
    yield put(actions.withdrawalSuccess(transaction));
  } else {
    yield put(actions.withdrawalFailure(failureReason));
  }

  return true;
}

function* loadConclusionProof(
  wallet: ChannelWallet,
  state: State
) {
  const yourQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${state.channel.id}/received`
  );
  const yourMove = yield call([yourQuery, yourQuery.once], 'value');
  const { state: yourState, signature: yourSignature } = yourMove.val();

  const myQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${state.channel.id}/sent`
  );
  const myMove = yield call([myQuery, myQuery.once], 'value');
  const { state: myState, signature: mySignature } = myMove.val();
  return new ConclusionProof(
    myState,
    yourState,
    mySignature,
    yourSignature,
  );
}