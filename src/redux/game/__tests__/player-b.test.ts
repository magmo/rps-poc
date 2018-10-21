import { gameReducer } from '../reducer';
import { Player, scenarios } from '../../../core';
import * as actions from '../actions';
import * as state from '../state';

import {
  itSends,
  itTransitionsTo,
  itStoresAction,
  itsPropertiesAreConsistentWithItsPosition,
  itCanHandleTheOpponentResigning,
} from './helpers';

const {
  preFundSetupA,
  preFundSetupB,
  postFundSetupA,
  postFundSetupB,
  asMove,
  bsMove,
  bResult,
  propose,
  accept,
  reveal,
  conclude,
  resting,
} = scenarios.aResignsAfterOneRound;

const {
  conclude: concludeResign,
} = scenarios.bResignsAfterOneRound;

const {
  accept: acceptInsufficientFunds,
  reveal: revealInsufficientFunds,
  conclude: concludeInsufficientFunds,
  conclude2: concludeInsufficientFunds2,

} = scenarios.insufficientFunds;

const { libraryAddress, channelNonce, participants, roundBuyIn, myName, opponentName } = scenarios.standard;
const base = { libraryAddress, channelNonce, participants, roundBuyIn, myName, opponentName };

const messageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

describe('player B\'s app', () => {
  const bProps = {
    ...base,
    player: Player.PlayerB as Player.PlayerB,
    turnNum: 0,
    balances: preFundSetupA.balances,
    stateCount: 0,
    latestPosition: preFundSetupA,
  };
  describe('when in confirmGameB', () => {
    const gameState: state.ConfirmGameB = {
      ...bProps,
      name: state.StateName.ConfirmGameB,
      latestPosition: preFundSetupA,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when player B confirms', () => {
      const action = actions.confirmGame();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(preFundSetupB, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);

      it('requests funding from the wallet', () => {
        expect(updatedState.messageState.walletOutbox).toEqual('FUNDING_REQUESTED');
      });

      it('transitions to WaitForFunding', () => {
        expect(updatedState.gameState.name).toEqual(state.StateName.WaitForFunding);
      });
    })
  });

  describe('when in waitForFunding', () => {
    const gameState: state.WaitForFunding = {
      ...bProps,
      name: state.StateName.WaitForFunding,
      latestPosition: preFundSetupB,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when funding is successful', () => {
      const action = actions.fundingSuccess();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itsPropertiesAreConsistentWithItsPosition(updatedState);
      itTransitionsTo(state.StateName.WaitForPostFundSetup, updatedState);
    });
  });

  describe('when in WaitForPostFundSetup', () => {
    const gameState: state.WaitForPostFundSetup = {
      ...bProps,
      name: state.StateName.WaitForPostFundSetup,
      latestPosition: preFundSetupB,
    };
    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when PostFundSetupA arrives', () => {
      const action = actions.positionReceived(postFundSetupA);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState);
      itSends(postFundSetupB, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in PickMove', () => {
    const gameState: state.PickMove = {
      ...bProps,
      name: state.StateName.PickMove,
      latestPosition: postFundSetupB,
      turnNum: postFundSetupB.turnNum,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when a move is chosen', () => {
      const action = actions.choosePlay(bsMove);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForOpponentToPickMoveB, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);

      it('stores the move', () => {
        const gameState = updatedState.gameState as state.WaitForOpponentToPickMoveA;
        expect(gameState.myMove).toEqual(bsMove);
      });
    });

    describe('if Propose arrives', () => {
      const action = actions.positionReceived(propose);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itStoresAction(action, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);

      describe('when a move is chosen', () => {
        const action = actions.choosePlay(bsMove);
        const updatedState2 = gameReducer(updatedState, action);

        itSends(accept, updatedState2);
        itTransitionsTo(state.StateName.WaitForRevealB, updatedState2);
      });
    })
  });

  describe('when in WaitForOpponentToPickMoveB', () => {
    const gameState: state.WaitForOpponentToPickMoveB = {
      ...bProps,
      name: state.StateName.WaitForOpponentToPickMoveB,
      latestPosition: postFundSetupB,
      myMove: bsMove,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when Propose arrives', () => {
      const action = actions.positionReceived(propose);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(accept, updatedState);
      itTransitionsTo(state.StateName.WaitForRevealB, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in WaitForRevealB', () => {
    const gameState: state.WaitForRevealB = {
      ...bProps,
      name: state.StateName.WaitForRevealB,
      latestPosition: accept,
      myMove: bsMove,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when Reveal arrives', () => {
      describe('if there are sufficient funds', () => {
        const action = actions.positionReceived(reveal);
        const updatedState = gameReducer({ messageState, gameState }, action);

        itTransitionsTo(state.StateName.PlayAgain, updatedState);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });

      describe('if there are not sufficient funds', () => {
        const action = actions.positionReceived(revealInsufficientFunds);
        const gameState2 = {
          ...gameState,
          balances: acceptInsufficientFunds.balances };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(concludeInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });
    });
  });

  describe('when in PlayAgain', () => {
    const gameState: state.PlayAgain = {
      ...bProps,
      name: state.StateName.PlayAgain,
      latestPosition: reveal,
      myMove: bsMove,
      theirMove: asMove,
      result: bResult,
      balances: reveal.balances,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('if the player decides to continue', () => {
      const action = actions.playAgain();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(resting, updatedState);
      itTransitionsTo(state.StateName.PickMove, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    describe('if the player decides not to continue', () => {
      const action = actions.resign();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(concludeResign, updatedState);
      itTransitionsTo(state.StateName.WaitForResignationAcknowledgement, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in InsufficientFunds', () => {
    const gameState: state.InsufficientFunds = {
      ...bProps,
      name: state.StateName.InsufficientFunds,
      latestPosition: revealInsufficientFunds,
      myMove: bsMove,
      theirMove: asMove,
      result: bResult,
      balances: revealInsufficientFunds.balances,
    };

    itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(concludeInsufficientFunds2);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.GameOver, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in WaitForResignationAcknowledgement', () => {
    const gameState: state.WaitForResignationAcknowledgement = {
      ...bProps,
      name: state.StateName.WaitForResignationAcknowledgement,
      latestPosition: conclude,
      balances: conclude.balances,
      turnNum: conclude.turnNum,
    };

    // todo: is this right? seems like it shouldn't handle it
    // itCanHandleTheOpponentResigning({ gameState, messageState });

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(conclude);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.GameOver, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in GameOver', () => {
    const gameState: state.GameOver = {
      ...bProps,
      name: state.StateName.GameOver,
      latestPosition: conclude,
      balances: conclude.balances,
      turnNum: conclude.turnNum,
    };

    describe('when the player wants to withdraw their funds', () => {
      const action = actions.withdrawalRequest();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForWithdrawal, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);

      it('requests a withdrawal from the wallet', () => {
        expect(updatedState.messageState.walletOutbox).toEqual('WITHDRAWAL');
      });
    });
  });
});
