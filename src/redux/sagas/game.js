import { select, put, takeEvery } from 'redux-saga/effects';

import { types, stateTransitioned } from '../actions/game';
import GameEngine from '../../game-engine/GameEngine';
import { getAddress } from '../reducers';

function* gameProposalSaga(action) {
  const opponentAddr = action.opponentAddress;
  const gameLibraryAddress = 0x00;
  const channelWallet = 'todo';

  const gameEngine = new GameEngine({ gameLibraryAddress, channelWallet });
  const myAddr = yield select(getAddress);
  const state = 1;
  const initialBals = [3, 3];
  const newState = gameEngine.setupGame({ myAddr, opponentAddr, state, initialBals });

  yield put(stateTransitioned(newState));
}

export default function* rootSaga() {
  yield takeEvery(types.PROPOSE_GAME, gameProposalSaga);
}
