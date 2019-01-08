import { gameReducer } from '../reducer';
import { scenarios } from '../../../core';
import * as actions from '../actions';
import * as state from '../state';

import {
  itSends,
  itTransitionsTo,
} from './helpers';

const {
  asAddress, bsAddress,channelNonce, libraryAddress, roundBuyIn, preFundSetupA,
} = scenarios.standard;

const params = { myName: 'Tom', roundBuyIn, myAddress:asAddress, libraryAddress, twitterHandle:"Tweet" };
const messageState = {};

describe('when in lobby', () => {
  const gameState = state.lobby(params);

  describe('when the player joins a open game', () => {
    const action = actions.joinOpenGame(
   'Andrew', bsAddress,channelNonce, roundBuyIn
    );
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.WaitForGameConfirmationA, updatedState);
    itSends(preFundSetupA, updatedState);
  });

  describe('when the player wants to create their own game', () => {
    const action = actions.newOpenGame();
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.CreatingOpenGame, updatedState);
  });
});

describe('when in creating open game', () => {
  const gameState = state.creatingOpenGame(params);

  describe('when the player finalizes the creation', () => {
    const action = actions.createOpenGame(roundBuyIn);
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.WaitingRoom, updatedState);
  });

  describe('when the player cancels', () => {
    const action = actions.cancelOpenGame();
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.Lobby, updatedState);
  });

});

describe('when in waiting room', () => {
  const gameState = state.waitingRoom(params);

  describe('when PreFundSetupA arrives', () => {
    const action = actions.initialPositionReceived(preFundSetupA,'Tom');
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.ConfirmGameB, updatedState);
  });

  describe('when the player cancels', () => {
    const action = actions.cancelOpenGame();
    const updatedState = gameReducer({ gameState, messageState }, action);

    itTransitionsTo(state.StateName.Lobby, updatedState);
  });
});
