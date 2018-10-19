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
const aResult = Result.YouWin;

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

const waitForGameConfirmationA = { ...sharedProps }
const confirmGameB = { ...sharedProps }

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


describe('player A\'s app', () => {
  const aProps = { ...sharedProps, player: Player.PlayerA as Player.PlayerA };

  describe('when in waitForGameConfirmationA', () => {
    const gameState: state.WaitForGameConfirmationA = {
      ...aProps,
      name: state.StateName.WaitForGameConfirmationA,
      latestPosition: preFundSetupA,
    };

    describe('when receiving preFundSetupB', () => {
      const action = actions.positionReceived(preFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

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
      ...aProps,
      name: state.StateName.WaitForFunding,
      latestPosition: preFundSetupB,
    };

    describe('when funding is successful', () => {
      const action = actions.fundingSuccess();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(postFundSetupA, updatedState);
      itTransitionsTo(state.StateName.WaitForPostFundSetup, updatedState);
    });
  });

  describe('when in WaitForPostFundSetup', () => {
    const gameState: state.WaitForPostFundSetup = {
      ...aProps,
      name: state.StateName.WaitForPostFundSetup,
      latestPosition: postFundSetupA,
    };
    describe('when PostFundSetupB arrives', () => {
      const action = actions.positionReceived(postFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState)
    });
  });

  describe('when in PickMove', () => {
    const gameState: state.PickMove = {
      ...aProps,
      name: state.StateName.PickMove,
      latestPosition: postFundSetupB,
    };

    describe('when a move is chosen', () => {
      const action = actions.choosePlay(aPlay);
      // todo: will need to stub out the randomness in the salt somehow
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(propose, updatedState);
      itTransitionsTo(state.StateName.WaitForOpponentToPickMoveA, updatedState);

      it('stores the move and salt', () => {
        const gameState = updatedState.gameState as state.WaitForOpponentToPickMoveA;
        expect(gameState.myMove).toEqual(aPlay);
        expect(gameState.salt).toEqual(salt);
      });
    });
  });

  describe('when in WaitForOpponentToPickMoveA', () => {
    const gameState: state.WaitForOpponentToPickMoveA = {
      ...aProps,
      name: state.StateName.WaitForOpponentToPickMoveA,
      latestPosition: postFundSetupB,
      myMove: aPlay,
      salt: salt,
    };
    describe('when Accept arrives', () => {
      const action = actions.positionReceived(accept);

      describe('when enough funds to continue', () => {
        const updatedState = gameReducer({ messageState, gameState }, action);

        itSends(reveal, updatedState);
        itTransitionsTo(state.StateName.PlayAgain, updatedState);
        it('sets theirMove and the result', () => {
          const gameState = updatedState.gameState as state.PlayAgain;
          expect(gameState.theirMove).toEqual(bPlay);
          expect(gameState.result).toEqual(aResult);
        });
      });

      describe('when not enough funds to continue', () => {
        const gameState2 = { ...gameState, balances: bLowFundsBalances };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(revealInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
      });
    });
  });

  describe('when in PlayAgain', () => {
    const gameState: state.PlayAgain = {
      ...aProps,
      name: state.StateName.PlayAgain,
      latestPosition: reveal,
      myMove: aPlay,
      theirMove: bPlay,
      result: aResult,
      balances: aWinsBalances,
    };

    describe('if the player decides to continue', () => {
      const action = actions.playAgain();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitForRestingA, updatedState);
    });

    describe('if the player decides not to continue', () => {
      const action = actions.resign();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.WaitToResign, updatedState);
    });

    describe('if Resting arrives', () => {
      const action = actions.positionReceived(resting);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itStoresAction(action, updatedState);

      describe('if the player decides to continue', () => {
        const action = actions.playAgain();
        const updatedState = gameReducer({ messageState, gameState }, action);

        itTransitionsTo(state.StateName.PickMove, updatedState);
      });

      describe('if the player decides not to continue', () => {
        const action = actions.resign();
        const updatedState = gameReducer({ messageState, gameState }, action);

        itSends(conclude, updatedState);
        itTransitionsTo(state.StateName.WaitToResign, updatedState);
      });
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
      balances: insufficientFundsBalances,
    };

    describe('when Conclude arrives', () => {
      const action = actions.positionReceived(concludeInsufficientFunds);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(concludeInsufficientFunds2, updatedState);
      itTransitionsTo(state.StateName.GameOver, updatedState);
    });
  });

  describe('when in WaitForResignationAcknowledgement', () => {
    const gameState: state.WaitForResignationAcknowledgement = {
      ...aProps,
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
});
