import BN from "bn.js";
import { PreFundSetupB, PostFundSetupA, PostFundSetupB, Propose, Accept, Reveal, Resting, Conclude, Play, PreFundSetupA, Result } from "../../../game-engine/positions";
import { Channel } from "fmg-core";
import { gameReducer } from '../reducer';
import { Player } from '../../../game-engine/application-states';
import * as actions from '../actions';
import * as state from '../state';

const libraryAddress = '0x123';
const channelNonce = '4';
const participants: [string, string] = ['0xa', '0xb'];
const roundBuyIn = new BN(1);
const initialBalances: [BN, BN] = [new BN(5), new BN(5)];
const aWinsBalances: [BN, BN] = [new BN(6), new BN(4)];
const bWinsBalances: [BN, BN] = [new BN(4), new BN(6)];
const bLowFundsBalances: [BN, BN] = [new BN(9), new BN(1)];
const insufficientFundsBalances: [BN, BN] = [new BN(10), new BN(0)];
const aPlay = Play.Rock;
const salt = '0x123';
const preCommit = '0x12345a';
const bPlay = Play.Scissors;
const bResult = Result.YouLose;

const sharedProps = {
  libraryAddress,
  channelNonce,
  participants,
  turnNum: 0,
  balances: initialBalances,
  stateCount: 0,
  roundBuyIn,
  myName: 'Tom',
  opponentName: 'Alex',
}
const channel = new Channel(libraryAddress, channelNonce, participants);
const preFundSetupA = new PreFundSetupA(channel, 0, initialBalances, 0, roundBuyIn);
const preFundSetupB = new PreFundSetupB(channel, 1, initialBalances, 1, roundBuyIn);
const postFundSetupA = new PostFundSetupA(channel, 2, initialBalances, 0, roundBuyIn);
const postFundSetupB = new PostFundSetupB(channel, 3, initialBalances, 1, roundBuyIn);
const propose = Propose.createWithPlayAndSalt(channel, 4, initialBalances, roundBuyIn, aPlay, salt);
const accept = new Accept(channel, 5, bWinsBalances, roundBuyIn, preCommit, bPlay);
const reveal = new Reveal(channel, 6, aWinsBalances, roundBuyIn, bPlay, aPlay, salt);
const resting = new Resting(channel, 7, aWinsBalances, roundBuyIn);
const conclude = new Conclude(channel, 8, aWinsBalances);
const conclude2 = new Conclude(channel, 9, aWinsBalances);
const revealInsufficientFunds = new Reveal(channel, 6, insufficientFundsBalances, roundBuyIn, bPlay, aPlay, salt);
const concludeInsufficientFunds = new Conclude(channel, 7, insufficientFundsBalances);
const concludeInsufficientFunds2 = new Conclude(channel, 8, insufficientFundsBalances);

const messageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

const itSends = (position, state) => {
  it(`sends ${position.constructor.name}`, () => {
    expect(state.messageState.opponentOutbox).toEqual(position);
  });
};

const itTransitionsTo = (stateName, state) => {
  it(`transitions to ${stateName}`, () => {
    expect(state.gameState.name).toEqual(stateName);
  });
};

const itStoresAction = (action, state) => {
  it(`stores action to retry`, () => {
    expect(state.messageState.actionToRetry).toEqual(action);
  });
};


describe('player B\'s app', () => {
  const bProps = { ...sharedProps, player: Player.PlayerB as Player.PlayerB };

  describe('when in confirmGameB', () => {
    const gameState: state.ConfirmGameB = {
      ...bProps,
      name: state.StateName.ConfirmGameB,
      latestPosition: preFundSetupA,
    };

    describe('when player B confirms', () => {
      const action = actions.confirmGame();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(preFundSetupB, updatedState);

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

    describe('when funding is successful', () => {
      const action = actions.fundingSuccess();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForPostFundSetup, updatedState);
    });
  });

  describe('when in WaitForPostFundSetup', () => {
    const gameState: state.WaitForPostFundSetup = {
      ...bProps,
      name: state.StateName.WaitForPostFundSetup,
      latestPosition: preFundSetupB,
    };
    describe('when PostFundSetupA arrives', () => {
      const action = actions.positionReceived(postFundSetupA);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState);
      itSends(postFundSetupB, updatedState);
    });
  });

  describe('when in PickMove', () => {
    const gameState: state.PickMove = {
      ...bProps,
      name: state.StateName.PickMove,
      latestPosition: postFundSetupB,
    };

    describe('when a move is chosen', () => {
      const action = actions.choosePlay(bPlay);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForOpponentToPickMoveB, updatedState);

      it('stores the move', () => {
        const gameState = updatedState.gameState as state.WaitForOpponentToPickMoveA;
        expect(gameState.myMove).toEqual(bPlay);
      });
    });

    describe('if Propose arrives', () => {
      const action = actions.positionReceived(propose);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itStoresAction(action, updatedState);

      describe('when a move is chosen', () => {
        const action = actions.choosePlay(bPlay);
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
      myMove: aPlay,
    };

    describe('when Propose arrives', () => {
      const action = actions.positionReceived(propose);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(accept, updatedState);
      itTransitionsTo(state.StateName.WaitForRevealB, updatedState);
    });
  });

  describe('when in WaitForRevealB', () => {
    const gameState: state.WaitForRevealB = {
      ...bProps,
      name: state.StateName.WaitForRevealB,
      latestPosition: accept,
      myMove: bPlay,
    };

    describe('when Reveal arrives', () => {
      const action = actions.positionReceived(reveal);

      describe('if there are sufficient funds', () => {
        const updatedState = gameReducer({ messageState, gameState }, action);

        itTransitionsTo(state.StateName.PlayAgain, updatedState);
      });

      describe('if there are not sufficient funds', () => {
        const gameState2 = { ...gameState, balances: insufficientFundsBalances };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(concludeInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
      });
    });
  });

  describe('when in PlayAgain', () => {
    const gameState: state.PlayAgain = {
      ...bProps,
      name: state.StateName.PlayAgain,
      latestPosition: reveal,
      myMove: bPlay,
      theirMove: aPlay,
      result: bResult,
      balances: aWinsBalances,
    };

    describe('if the player decides to continue', () => {
      const action = actions.playAgain();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(resting, updatedState);
      itTransitionsTo(state.StateName.PickMove, updatedState);
    });

    describe('if the player decides not to continue', () => {
      const action = actions.resign();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(conclude, updatedState);
      itTransitionsTo(state.StateName.WaitForResignationAcknowledgement, updatedState);
    });
  });

  describe('when in InsufficientFunds', () => {
    const gameState: state.InsufficientFunds = {
      ...bProps,
      name: state.StateName.InsufficientFunds,
      latestPosition: revealInsufficientFunds,
      myMove: bPlay,
      theirMove: aPlay,
      result: bResult,
      balances: insufficientFundsBalances,
    };

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(concludeInsufficientFunds2);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.GameOver, updatedState);
    });
  });

  describe('when in WaitForResignationAcknowledgement', () => {
    const gameState: state.WaitForResignationAcknowledgement = {
      ...bProps,
      name: state.StateName.WaitForResignationAcknowledgement,
      latestPosition: conclude,
      balances: aWinsBalances,
    };

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(conclude);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.GameOver, updatedState);
    });
  });

  describe('when in GameOver', () => {
    const gameState: state.GameOver = {
      ...bProps,
      name: state.StateName.GameOver,
      latestPosition: conclude,
      balances: aWinsBalances,
    };

    describe('when the player wants to withdraw their funds', () => {
      const action = actions.withdrawalRequest();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForWithdrawal, updatedState);

      it('requests a withdrawal from the wallet', () => {
        expect(updatedState.messageState.walletOutbox).toEqual('WITHDRAWAL');
      });
    });
  });
});
