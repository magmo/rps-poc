import BN from "bn.js";
import { gameReducer } from '../reducer';
import { Player } from '../../../game-engine/application-states';
import * as actions from '../actions';
import * as state from '../state';
import * as scenarios from './scenarios';

import {
  itSends,
  itTransitionsTo,
  itStoresAction,
  itsPropertiesAreConsistentWithItsPosition,
  itHandlesResignWhenMyTurn,
  itHandlesResignWhenTheirTurn,
} from './helpers';

const {
  preFundSetupA,
  preFundSetupB,
  postFundSetupA,
  postFundSetupB,
  aPlay,
  bPlay,
  salt,
  aResult,
  propose,
  accept,
  reveal,
  resting,
  conclude,
} = scenarios.aResignsAfterOneRound;

const {
  propose: proposeInsufficientFunds,
  accept: acceptInsufficientFunds,
  reveal: revealInsufficientFunds,
  conclude: concludeInsufficientFunds,
  conclude2: concludeInsufficientFunds2,
} = scenarios.insufficientFunds;

const { libraryAddress, channelNonce, participants, roundBuyIn, myName, opponentName } = scenarios.standard;
const base = { libraryAddress, channelNonce, participants, roundBuyIn, myName, opponentName };

const messageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

describe('player A\'s app', () => {
  const aProps = {
    ...base,
    player: Player.PlayerA as Player.PlayerA,
    turnNum: 0,
    balances: preFundSetupA.resolution as [BN, BN],
    stateCount: 0,
    latestPosition: preFundSetupA,
  };

  describe('when in waitForGameConfirmationA', () => {
    const gameState: state.WaitForGameConfirmationA = {
      ...aProps, name: state.StateName.WaitForGameConfirmationA, turnNum: 0,
    };

    describe('when receiving preFundSetupB', () => {
      const action = actions.positionReceived(preFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

      it('requests funding from the wallet', () => {
        expect(updatedState.messageState.walletOutbox).toEqual('FUNDING_REQUESTED');
      });

      itsPropertiesAreConsistentWithItsPosition(updatedState);
      itTransitionsTo(state.StateName.WaitForFunding, updatedState);
    });

    itHandlesResignWhenTheirTurn({ messageState, gameState });
  });

  describe('when in waitForFunding', () => {
    const gameState: state.WaitForFunding = {
      ...aProps,
      name: state.StateName.WaitForFunding,
      latestPosition: preFundSetupB,
      turnNum: preFundSetupB.turnNum,
      stateCount: preFundSetupB.stateCount,
    };

    describe('when funding is successful', () => {
      const action = actions.fundingSuccess();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(postFundSetupA, updatedState);
      itTransitionsTo(state.StateName.WaitForPostFundSetup, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    itHandlesResignWhenMyTurn({ messageState, gameState });
  });

  describe('when in WaitForPostFundSetup', () => {
    const gameState: state.WaitForPostFundSetup = {
      ...aProps,
      name: state.StateName.WaitForPostFundSetup,
      latestPosition: postFundSetupA,
      turnNum: postFundSetupA.turnNum,
      stateCount: postFundSetupA.stateCount,
    };
    describe('when PostFundSetupB arrives', () => {
      const action = actions.positionReceived(postFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    itHandlesResignWhenTheirTurn({ messageState, gameState});
  });

  describe('when in PickMove', () => {
    const gameState: state.PickMove = {
      ...aProps,
      name: state.StateName.PickMove,
      latestPosition: postFundSetupB,
      turnNum: postFundSetupB.turnNum,
      stateCount: postFundSetupB.stateCount,
    };

    describe('when a move is chosen', () => {
      const action = actions.choosePlay(aPlay);
      // todo: will need to stub out the randomness in the salt somehow
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(propose, updatedState);
      itTransitionsTo(state.StateName.WaitForOpponentToPickMoveA, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);

      it('stores the move and salt', () => {
        const newGameState = updatedState.gameState as state.WaitForOpponentToPickMoveA;
        expect(newGameState.myMove).toEqual(aPlay);
        expect(newGameState.salt).toEqual(salt);
      });

    });

    itHandlesResignWhenMyTurn({ messageState, gameState});
  });

  describe('when in WaitForOpponentToPickMoveA', () => {
    const gameState: state.WaitForOpponentToPickMoveA = {
      ...aProps,
      name: state.StateName.WaitForOpponentToPickMoveA,
      latestPosition: propose,
      myMove: aPlay,
      salt,
      turnNum: propose.turnNum,
    };

    describe('when Accept arrives', () => {
      describe('when enough funds to continue', () => {
        const action = actions.positionReceived(accept);

        const updatedState = gameReducer({ messageState, gameState }, action);

        itSends(reveal, updatedState);
        itTransitionsTo(state.StateName.PlayAgain, updatedState);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
        it('sets theirMove and the result', () => {
          const newGameState = updatedState.gameState as state.PlayAgain;
          expect(newGameState.theirMove).toEqual(bPlay);
          expect(newGameState.result).toEqual(aResult);
        });
      });

      describe('when not enough funds to continue', () => {
        const action = actions.positionReceived(acceptInsufficientFunds);
        const gameState2 = {
          ...gameState,
          balances: proposeInsufficientFunds.resolution as [BN, BN],
          latestPosition: proposeInsufficientFunds
        };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(revealInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });
    });

    itHandlesResignWhenTheirTurn({ messageState, gameState});
  });

  describe('when in PlayAgain', () => {
    const gameState: state.PlayAgain = {
      ...aProps,
      name: state.StateName.PlayAgain,
      latestPosition: reveal,
      myMove: aPlay,
      theirMove: bPlay,
      result: aResult,
      balances: reveal.resolution as [BN, BN],
      turnNum: reveal.turnNum,
    };

    describe('if the player decides to continue', () => {
      const action = actions.playAgain();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForRestingA, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    describe('if the player decides not to continue', () => {
      const action = actions.resign();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitToResign, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    describe('if Resting arrives', () => {
      const action = actions.positionReceived(resting);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itStoresAction(action, updatedState);

      describe('if the player decides to continue', () => {
        const playAction = actions.playAgain();
        const updatedState2 = gameReducer(updatedState, playAction);

        itTransitionsTo(state.StateName.PickMove, updatedState2);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });

      describe('if the player decides not to continue', () => {
        const resignAction = actions.resign();
        const updatedState2 = gameReducer(updatedState, resignAction);

        itSends(conclude, updatedState2);
        itTransitionsTo(state.StateName.WaitForResignationAcknowledgement, updatedState2);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });
    });
  });

  describe('when in WaitForRestingA', () => {
    const gameState: state.WaitForRestingA = {
      ...aProps,
      name: state.StateName.WaitForRestingA,
      latestPosition: reveal,
      myMove: aPlay,
      theirMove: bPlay,
      result: aResult,
      turnNum: reveal.turnNum,
    };

    describe('when resting arrives', () => {
      const action = actions.positionReceived(resting);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });

    itHandlesResignWhenTheirTurn({ messageState, gameState});
  });


  describe('when in WaitToResign', () => {
    const gameState: state.WaitToResign = {
      ...aProps,
      name: state.StateName.WaitToResign,
      latestPosition: revealInsufficientFunds,
      turnNum: revealInsufficientFunds.turnNum,
      balances: revealInsufficientFunds.resolution as [BN, BN],
    };

    describe('when any position arrives', () => {
      const action = actions.positionReceived(resting);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(conclude, updatedState);
      itTransitionsTo(state.StateName.WaitForResignationAcknowledgement, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });


  describe('when in InsufficientFunds', () => {
    const gameState: state.InsufficientFunds = {
      ...aProps,
      name: state.StateName.InsufficientFunds,
      latestPosition: revealInsufficientFunds,
      myMove: aPlay,
      theirMove: bPlay,
      result: aResult,
      balances: revealInsufficientFunds.resolution as [BN, BN],
      turnNum: revealInsufficientFunds.turnNum,
    };

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(concludeInsufficientFunds);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(concludeInsufficientFunds2, updatedState);
      itTransitionsTo(state.StateName.GameOver, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in WaitForResignationAcknowledgement', () => {
    const gameState: state.WaitForResignationAcknowledgement = {
      ...aProps,
      name: state.StateName.WaitForResignationAcknowledgement,
      latestPosition: conclude,
      balances: conclude.resolution as [BN, BN],
      turnNum: conclude.turnNum,
    };

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(conclude);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.GameOver, updatedState);
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });

  describe('when in GameOver', () => {
    const gameState: state.GameOver = {
      ...aProps,
      name: state.StateName.GameOver,
      latestPosition: conclude,
      balances: conclude.resolution as [BN, BN],
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
