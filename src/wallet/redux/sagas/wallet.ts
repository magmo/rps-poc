import { actionChannel, take, put, fork, call, cancel, } from 'redux-saga/effects';
import { State, SolidityType, decodeSignature } from 'fmg-core';

import { AUTO_OPPONENT_ADDRESS } from '../../../constants';
import { default as firebase, reduxSagaFirebase, serverTimestamp } from '../../../gateways/firebase';

import ChannelWallet, { SignableData } from '../../domain/ChannelWallet';
import { ConclusionProof } from '../../domain/ConclusionProof';
import decode from '../../domain/decode';
import WalletEngine from '../../wallet-engine/WalletEngine';

import * as actions from '../actions/external';
import * as blockchainActions from '../actions/blockchain';
import * as stateActions from '../actions/state';
import * as playerActions from '../actions/player';
import * as displayActions from '../actions/display';

import { initializeWallet } from './initialization';
import { fundingSaga } from './funding';
import { blockchainSaga } from './blockchain';
import { ChallengeProof } from '../../domain/ChallengeProof';
import { Signature } from 'src/wallet/domain/Signature';
import challengeSaga from './challenge';

export function* walletSaga(uid: string): IterableIterator<any> {
  const wallet = (yield initializeWallet(uid)) as ChannelWallet;
  const walletEngine = new WalletEngine();

  yield put(actions.initializationSuccess(wallet.address));

  yield fork(handleRequests, wallet, walletEngine);
}

function* handleRequests(wallet: ChannelWallet, walletEngine: WalletEngine) {
  let runningBlockchainSaga = null;
  let runningEventListener = null;
  const channel = yield actionChannel([
    actions.FUNDING_REQUEST,
    actions.SIGNATURE_REQUEST,
    actions.VALIDATION_REQUEST,
    actions.WITHDRAWAL_REQUEST,
    actions.OPEN_CHANNEL_REQUEST,
    actions.CLOSE_CHANNEL_REQUEST,
    actions.STORE_MESSAGE_REQUEST,
    actions.CREATE_CHALLENGE_REQUEST,
    actions.CHALLENGE_RESPONSE_REQUEST,
  ]);
  while (true) {
    const action: actions.RequestAction = yield take(channel);

    // The handlers below will block, so the wallet will only ever
    // process one action at a time from the queue.
    switch (action.type) {
      case actions.OPEN_CHANNEL_REQUEST:
        runningBlockchainSaga = yield fork(blockchainSaga);
        runningEventListener = yield fork(blockchainEventListener, wallet);
        yield wallet.openChannel(action.channel);
        yield put(actions.channelOpened(wallet.channelId));
        break;

      case actions.CLOSE_CHANNEL_REQUEST:
        if (runningBlockchainSaga != null) {
          yield cancel(runningBlockchainSaga);
        }
        if (runningEventListener != null) {
          yield cancel(runningEventListener);
        }
        yield wallet.closeChannel();
        yield put(actions.channelClosed(wallet.id));
        break;

      case actions.SIGNATURE_REQUEST:
        yield handleSignatureRequest(wallet, action.requestId, action.data);
        break;

      case actions.STORE_MESSAGE_REQUEST:
        yield handleStoreMessageRequest(
          wallet,
          action.positionData,
          action.signature,
          action.direction,
        );
        break;

      case actions.VALIDATION_REQUEST:
        yield handleValidationRequest(
          wallet,
          action.requestId,
          action.data,
          action.signature,
          action.opponentIndex,
        );
        break;

      case actions.FUNDING_REQUEST:

        walletEngine.setup(action);
        // Save the initial state
        yield put(stateActions.stateChanged(walletEngine.state));
        yield fork(handleFundingRequest, wallet, walletEngine, action.playerIndex);
        break;

      case actions.WITHDRAWAL_REQUEST:
        const { position } = action;
        yield handleWithdrawalRequest(wallet, walletEngine, position);
        break;
      case actions.CREATE_CHALLENGE_REQUEST:
        yield handleChallengeRequest(wallet, walletEngine);
        break;
      case actions.CHALLENGE_RESPONSE_REQUEST:
        yield handleChallengeResponse(wallet, walletEngine, action.positionData);
        break;
      default:
        // @ts-ignore
        const _exhaustiveCheck: never = action;
    }
  }
}

function* handleChallengeRequest(wallet: ChannelWallet, walletEngine: WalletEngine) {
  const challengeProof = yield loadChallengeProof(wallet, wallet.channelId);

  yield put(blockchainActions.forceMove(challengeProof));
  // const { createdChallengeProof } = yield take(blockchainActions.CHALLENGECREATED_EVENT);
}

function* handleChallengeResponse(wallet: ChannelWallet, walletEngine: WalletEngine, positionData: string) {
  const signature = new Signature(wallet.sign(positionData));
  // We store the latest message manually as it won't be sent as a message 
  // and stored automatically.
  yield handleStoreMessageRequest(wallet, positionData, signature.signature, "sent");
  yield put(blockchainActions.respondWithMoveRequest(positionData, signature));
  yield take([
    blockchainActions.CHALLENGECONCLUDED_EVENT,
    blockchainActions.RESPONDWITHMOVE_FAILURE,
  ]);
}

function* handleSignatureRequest(
  wallet: ChannelWallet,
  requestId: string,
  data: SignableData
) {
  // TODO: Validate transition
  const signature: string = wallet.sign(data);
  yield put(actions.signatureSuccess(requestId, signature));
}

function* handleStoreMessageRequest(
  wallet: ChannelWallet,
  positionData: string,
  signature: string,
  direction: "sent" | "received"
) {
  const channelId = decode(positionData).channel.id;
  yield call(
    reduxSagaFirebase.database.update,
    `wallets/${wallet.id}/channels/${channelId}/${direction}`,
    { state: positionData, signature, updatedAt: serverTimestamp }
  );
}

function* handleValidationRequest(
  wallet: ChannelWallet,
  requestId,
  data: SignableData,
  signature: string,
  opponentIndex,
) {
  const address = wallet.recover(data, signature);
  // The wallet should also have the channel, except when the data is the first message
  // that the player has received.
  // So, we need to read the channel off of the decoded data, rather than the wallet.
  const state = decode(data);
  if (state.channel.participants[opponentIndex].toLowerCase() !== address.toLowerCase()) {
    yield put(actions.validationFailure(requestId, 'INVALID SIGNATURE'));
  }

  yield put(actions.validationSuccess(requestId));
}

function* handleFundingRequest(wallet: ChannelWallet, walletEngine: WalletEngine) {
  yield put(displayActions.showWallet());
  let success;
  if (walletEngine.opponentAddress === AUTO_OPPONENT_ADDRESS) {
    success = true;
  } else {
    success = yield fundingSaga(wallet.channelId, walletEngine);
  }

  if (success) {
    yield put(actions.fundingSuccess(wallet.channelId));
  } else {
    yield put(actions.fundingFailure(wallet.channelId, 'Something went wrong'));
  }
  yield put(displayActions.hideWallet());
  return true;
}

export function* handleWithdrawalRequest(
  wallet: ChannelWallet,
  walletEngine: WalletEngine,
  position: State
) {
  // TODO: There's probably enough logic here to pull it out into it's own saga
  const { address: playerAddress, channelId } = wallet;

  walletEngine.requestWithdrawalAddress();
  yield put(stateActions.stateChanged(walletEngine.state));

  const action = yield take(playerActions.SELECT_WITHDRAWAL_ADDRESS);
  const destination = action.address;
  walletEngine.selectWithdrawalAddress(action.address);
  yield put(stateActions.stateChanged(walletEngine.state));

  const data = [
    { type: SolidityType.address, value: playerAddress },
    { type: SolidityType.address, value: destination },
    { type: SolidityType.bytes32, value: wallet.channelId },
  ];

  const { v, r, s } = decodeSignature(wallet.sign(data));

  const proof = yield call(loadConclusionProof, wallet, position);

  yield put(blockchainActions.withdrawRequest(proof, { playerAddress, channelId, destination, v, r, s }));
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

function* blockchainEventListener(wallet: ChannelWallet) {
  const channel = yield actionChannel([blockchainActions.CHALLENGECONCLUDED_EVENT, blockchainActions.CHALLENGECREATED_EVENT]);

  const action = yield take(channel);
  const myQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${wallet.channelId}/sent`
  );
  const myMove = yield call([myQuery, myQuery.once], 'value');
  const { state: myState } = myMove.val();

  switch (action.type) {
    case blockchainActions.CHALLENGECREATED_EVENT:
      const challengeHandler = yield fork(challengeSaga, action, myState);

      break;
    case blockchainActions.CHALLENGECONCLUDED_EVENT:
      yield cancel(challengeHandler);
      break;
  }
}

function* loadConclusionProof(
  wallet: ChannelWallet,
  state: State
) {
  const yourQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${state.channel.id}/received`
  );
  const yourMove = yield call([yourQuery, yourQuery.once], 'value');
  const { state: yourState, signature: yourSignature, updatedAt: yourUpdatedAt } = yourMove.val();

  const myQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${state.channel.id}/sent`
  );
  const myMove = yield call([myQuery, myQuery.once], 'value');
  const { state: myState, signature: mySignature, updatedAt: myUpdatedAt } = myMove.val();
  if (myUpdatedAt > yourUpdatedAt) {
    return new ConclusionProof(
      yourState,
      myState,
      yourSignature,
      mySignature,
    );
  } else {
    return new ConclusionProof(
      myState,
      yourState,
      mySignature,
      yourSignature,
    );
  }
}

function* loadChallengeProof(
  wallet: ChannelWallet,
  channelId: string
) {
  const yourQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${channelId}/received`
  );
  const yourMove = yield call([yourQuery, yourQuery.once], 'value');
  const { state: yourState, signature: yourSignature } = yourMove.val();

  const myQuery = firebase.database().ref(
    `wallets/${wallet.id}/channels/${channelId}/sent`
  );
  const myMove = yield call([myQuery, myQuery.once], 'value');
  const { state: myState, signature: mySignature } = myMove.val();

  return new ChallengeProof(
    yourState,
    myState,
    yourSignature,
    mySignature,
  );
}