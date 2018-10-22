import { gameReducer } from '../reducer';
import { Player, scenarios } from '../../../core';
import * as actions from '../actions';
import * as state from '../state';

import {
  itSends,
  itTransitionsTo,
  itStoresAction,
  itHandlesResignLikeItsMyTurn,
  itHandlesResignLikeItsTheirTurn,
} from './helpers';

const {
  asAddress, bsAddress, libraryAddress, channelNonce, roundBuyIn, preFundSetupA
} = scenarios.standard;

const params = { myName: 'Tom', roundBuyIn };
const messageState = {};

describe('when in lobby', () => {
  const gameState = state.lobby(params);

  describe('when the player creates a game', () => {
    const action = actions.createGame(
      'Tom', asAddress, 'Andrew', bsAddress, libraryAddress, channelNonce, roundBuyIn
    );
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.WaitForGameConfirmationA, updatedState);
    itSends(preFundSetupA, updatedState);
  });
});

describe('when in waiting room', () => {
  const gameState = state.waitingRoom(params);

  describe('when PreFundSetupA arrives', () => {
    const action = actions.positionReceived(preFundSetupA);
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.ConfirmGameB, updatedState);
  });
});
