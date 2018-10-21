import { gameReducer } from '../reducer';
import * as actions from '../actions';
import * as state from '../state';
import { scenarios } from '../../../core';
import { itSends, itTransitionsTo } from './helpers';

const nullMessageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

const {
  libraryAddress,
  addrPlayerA,
  addrPlayerB,
  channelNonce,
  roundBuyIn,
  preFundSetupA,
} = scenarios.standard;

describe('when in NotStarted', () => {
  describe('when in NotStarted', () => {
    const gameState: state.NotStarted = {
      name: state.StateName.NotStarted,
    };

    describe('when accepting a game', () => {
      const myName = 'myName';
      const opponentName = 'opponentName';
      const action = actions.acceptGame(
        myName,
        addrPlayerA,
        opponentName,
        addrPlayerB,
        libraryAddress,
        channelNonce,
        roundBuyIn,
      );

      const updatedState = gameReducer({ messageState: nullMessageState, gameState }, action);

      itSends(preFundSetupA, updatedState);
      itTransitionsTo(state.StateName.WaitForGameConfirmationA, updatedState);
    });
  });
});
