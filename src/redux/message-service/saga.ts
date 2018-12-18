import { fork, take, call, put, select, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import hash from 'object-hash';

import { reduxSagaFirebase } from '../../gateways/firebase';
import * as fromWalletActions from '../../wallet/interface/outgoing';
import * as toWalletActions from '../../wallet/interface/incoming';
import { encode, decode, Player, positions } from '../../core';
import * as gameActions from '../game/actions';
import { MessageState } from './state';
import * as gameStates from '../game/state';
import { Channel, State } from 'fmg-core';
import { getMessageState, getGameState } from '../store';

import hexToBN from '../../utils/hexToBN';

export enum Queue {
  WALLET = 'WALLET',
  GAME_ENGINE = 'GAME_ENGINE',
}

export const getWalletAddress = (storeObj: any) => storeObj.wallet.address;

export default function* messageSaga() {
  yield fork(waitForWalletThenReceiveFromFirebaseSaga);
  yield fork(receiveFromWalletSaga);
  yield fork(sendMessagesSaga);
  yield fork(sendWalletMessageSaga);
}

export function* sendWalletMessageSaga() {
  while (true) {
    const action = yield take(fromWalletActions.SEND_MESSAGE);
    const queue = Queue.WALLET;
    const { data, to, signature } = action;
    const message = { data, queue, signature };
    yield call(reduxSagaFirebase.database.create, `/messages/${to.toLowerCase()}`, message);
  }
}

export function* sendMessagesSaga() {
  // We need to use an actionChannel to queue up actions that
  // might be put from this saga
  const channel = yield actionChannel([
    gameActions.CHOOSE_MOVE,
    gameActions.CONFIRM_GAME,
    gameActions.CREATE_OPEN_GAME,
    gameActions.INITIAL_POSITION_RECEIVED,
    gameActions.PLAY_AGAIN,
    gameActions.POSITION_RECEIVED,
    gameActions.FUNDING_SUCCESS,
    gameActions.WITHDRAWAL_REQUEST,
    gameActions.WITHDRAWAL_SUCCESS,
    gameActions.JOIN_OPEN_GAME,
    gameActions.RESIGN,
  ]);
  while (true) {
    // We take any action that might trigger the outbox to be updated
    yield take(channel);

    const messageState: MessageState = yield select(getMessageState);
    const gameState: gameStates.GameState = yield select(getGameState);
    if (messageState.opponentOutbox) {
      const queue = Queue.GAME_ENGINE;
      const data = encode(messageState.opponentOutbox.position);
      const signature = yield signMessage(data);
      const userName = gameState.name !== gameStates.StateName.NoName ? gameState.myName : "";
      const message = { data, queue, signature, userName };
      const { opponentAddress } = messageState.opponentOutbox;

      yield put(toWalletActions.messageSent(data, signature));
      yield call(reduxSagaFirebase.database.create, `/messages/${opponentAddress.toLowerCase()}`, message);
      yield put(gameActions.messageSent());
    }
    if (messageState.walletOutbox) {
      if (
        gameState.name !== gameStates.StateName.Lobby &&
        gameState.name !== gameStates.StateName.WaitingRoom &&
        gameState.name !== gameStates.StateName.CreatingOpenGame &&
        gameState.name !== gameStates.StateName.NoName
      ) {
        yield handleWalletMessage(messageState.walletOutbox, gameState);
      }
    }

  }
}

function* waitForWalletThenReceiveFromFirebaseSaga() {
  while (true) {
    yield take('*');

    const address = yield select(getWalletAddress);

    if (address) {
      // this will never return
      yield receiveFromFirebaseSaga(address);
    }
  }
}

function* receiveFromFirebaseSaga(address) {
  address = address.toLowerCase();

  const channel = yield call(
    reduxSagaFirebase.database.channel,
    `/messages/${address}`,
    'child_added',
    buffers.fixed(10),
  );

  while (true) {
    const message = yield take(channel);

    const key = message.snapshot.key;
    const { data, queue, userName } = message.value;

    if (queue === Queue.GAME_ENGINE) {
      const { signature } = message.value;
      const validMessage = yield validateMessage(data, signature);
      if (!validMessage) {
        // TODO: Handle this
      }
      const position = decode(data);
      if (position.name === positions.PRE_FUND_SETUP_A) {
        yield put(gameActions.initialPositionReceived(position, userName ? userName : 'Opponent'));
      } else {
        yield put(gameActions.positionReceived(position));
      }
    } else {
      const { signature } = message.value;
      yield put(toWalletActions.receiveMessage(data, signature));
    }
    yield call(reduxSagaFirebase.database.delete, `/messages/${address}/${key}`);
  }
}
function* handleWalletMessage(type, state: gameStates.PlayingState) {
  const { libraryAddress, channelNonce, player, balances, participants } = state;
  const channel = new Channel(libraryAddress, channelNonce, participants);
  const channelId = channel.id;

  switch (type) {
    case "FUNDING_REQUESTED":
      // TODO: We need to close the channel at some point
      yield put(toWalletActions.openChannelRequest(channel));
      const myIndex = player === Player.PlayerA ? 0 : 1;

      const opponentAddress = participants[1 - myIndex];
      const myAddress = participants[myIndex];
      const myBalance = hexToBN(balances[myIndex]);
      const opponentBalance = hexToBN(balances[1 - myIndex]);

      yield put(toWalletActions.fundingRequest(channelId, myAddress, opponentAddress, myBalance, opponentBalance, myIndex));
      const action = yield take([fromWalletActions.FUNDING_SUCCESS, fromWalletActions.FUNDING_FAILURE]);
      switch (action.type) {
        case fromWalletActions.FUNDING_SUCCESS:
          yield put(gameActions.messageSent());
          const position = decode(action.position);
          yield put(gameActions.fundingSuccess(position));
          break;
        case fromWalletActions.FUNDING_FAILURE:
          yield put(gameActions.fundingFailure());
          break;
        default:
          throw new Error("Expected FUNDING_SUCCESS or FUNDING_FAILURE");
      }
      break;
    case "WITHDRAWAL_REQUESTED":
      const { turnNum } = positions.conclude(state);
      const channelState = new State({
        channel,
        stateType: State.StateType.Conclude,
        turnNum,
        resolution: balances.map(hexToBN),
        stateCount: 0,
      });
      yield put(toWalletActions.withdrawalRequest(channelState));
      yield take(fromWalletActions.WITHDRAWAL_SUCCESS);
      yield put(gameActions.messageSent());
      yield put(gameActions.withdrawalSuccess());
      yield put(toWalletActions.closeChannelRequest());

  }
}

function* receiveFromWalletSaga() {
  while (true) {
    // TODO: Implement this when action is defined
    // const { position } = yield take(fromWalletActions.CHALLENGE_POSITION_RECEIVED);
    // yield put(gameActions.positionReceived(position));
  }
}

function* validateMessage(data, signature) {
  const requestId = hash(data + Date.now());
  yield put(toWalletActions.validationRequest(requestId, data, signature));
  const actionFilter = [fromWalletActions.VALIDATION_SUCCESS, fromWalletActions.VALIDATION_FAILURE];
  const action: fromWalletActions.ValidationResponse = yield take(actionFilter);
  // while (action.requestId !== requestId) {
  //   action = yield take(actionFilter);
  // }
  if (action.type === fromWalletActions.VALIDATION_SUCCESS) {
    return true;
  } else {
    // TODO: Properly handle this.
    throw new Error("Signature Validation error");
  }
}

function* signMessage(data) {
  const requestId = hash(data + Date.now());

  yield put(toWalletActions.signatureRequest(requestId, data));
  // TODO: Handle signature failure
  const actionFilter = fromWalletActions.SIGNATURE_SUCCESS;
  const signatureResponse: fromWalletActions.SignatureSuccess = yield take(actionFilter);
  // while (signatureResponse.requestId !== requestId) {
  //   signatureResponse = yield take(actionFilter);
  // }
  return signatureResponse.signature;
}
