import BN from "bn.js";
import { PreFundSetupB, PostFundSetupA, PostFundSetupB, Propose, Accept, Reveal, Resting, Conclude, Play, PreFundSetupA, Result, hashCommitment } from "../../../game-engine/positions";
import { Channel } from "fmg-core";
import { gameReducer, JointState } from '../reducer';
import { Player } from '../../../game-engine/application-states';
import * as actions from '../actions';
import * as state from '../state';
import { randomHex } from "../../../utils/randomHex";


const libraryAddress = '0x' + '1'.repeat(40);
const channelNonce = '4';
const participants: [string, string] = ['0x' + 'a'.repeat(40), '0x' + 'b'.repeat(40)];
const roundBuyIn = new BN(1);
const initialBalances: [BN, BN] = [new BN(5), new BN(5)];
const aWinsBalances: [BN, BN] = [new BN(6), new BN(4)];
const bWinsBalances: [BN, BN] = [new BN(4), new BN(6)];
const bLowFundsBalances: [BN, BN] = [new BN(9), new BN(1)];
const bLowButWinsFundsBalances: [BN, BN] = [new BN(8), new BN(2)];
const insufficientFundsBalances: [BN, BN] = [new BN(10), new BN(0)];
const aPlay = Play.Rock;
const salt = randomHex(64);
const preCommit = hashCommitment(aPlay, salt);
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
};

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

const proposeBLow = Propose.createWithPlayAndSalt(channel, 4, bLowFundsBalances, roundBuyIn, aPlay, salt);
const acceptBLow = new Accept(channel, 5, bLowButWinsFundsBalances, roundBuyIn, preCommit, bPlay);
const revealInsufficientFunds = new Reveal(channel, 6, insufficientFundsBalances, roundBuyIn, bPlay, aPlay, salt);
const concludeInsufficientFunds = new Conclude(channel, 7, insufficientFundsBalances);
const concludeInsufficientFunds2 = new Conclude(channel, 8, insufficientFundsBalances);

const messageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

const itSends = (position, jointState) => {
  it(`sends ${position.constructor.name}`, () => {
    expect(jointState.messageState.opponentOutbox).toEqual(position);
  });
};

const itTransitionsTo = (stateName, jointState) => {
  it(`transitions to ${stateName}`, () => {
    expect(jointState.gameState.name).toEqual(stateName);
  });
};

const itStoresAction = (action, jointState) => {
  it(`stores action to retry`, () => {
    expect(jointState.messageState.actionToRetry).toEqual(action);
  });
};

const itsPropertiesAreConsistentWithItsPosition = (state) => {
  it(`updates its properties to be consistent with the latest position`, () => {
    const gameState = state.gameState;
    const position = gameState.latestPosition;
    expect(gameState.balances).toEqual(position.resolution);
    expect(gameState.turnNum).toEqual(position.turnNum);
  });
}

const itHandlesResignWhenTheirMove = (jointState: JointState) => {
  describe('when resigning', () => {
    it ('transitions to WaitToResign', () => {
      const { gameState } = jointState;
      const { latestPosition: oldPosition } = gameState;
      const updatedState = gameReducer(jointState, actions.resign());
      const { latestPosition: position } = updatedState.gameState;

      expect(updatedState.gameState.name).toEqual(state.StateName.WaitToResign);
      expect(updatedState.gameState).toMatchObject({
        name: state.StateName.WaitToResign,
        turnNum: oldPosition.turnNum,
      });
      expect(position).toEqual(oldPosition);
    });
  });
};

const itHandlesResignWhenMyMove = (jointState: JointState) => {
  describe('when my opponent resigns', () => {
    it ('transitions to WaitToResign', () => {
      const { gameState } = jointState;
      const { latestPosition: oldPosition } = gameState;
      const updatedState = gameReducer(jointState, actions.resign());
      const { latestPosition: position } = updatedState.gameState;

      expect(updatedState.gameState.name).toEqual(state.StateName.WaitForResignationAcknowledgement);
      expect(updatedState.gameState).toMatchObject({
        name: state.StateName.WaitForResignationAcknowledgement,
        turnNum: oldPosition.turnNum + 1,
        balances: gameState.balances,
        player: Player.PlayerA,
      });
      const newConclude = new Conclude(channel, oldPosition.turnNum + 1, oldPosition.resolution);
      expect(position).toEqual(newConclude);
    });
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

      itsPropertiesAreConsistentWithItsPosition(updatedState);
      itTransitionsTo(state.StateName.WaitForFunding, updatedState);
    });

    itHandlesResignWhenTheirMove({ messageState, gameState });
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

    itHandlesResignWhenMyMove({ messageState, gameState });
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

    itHandlesResignWhenTheirMove({ messageState, gameState});
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

    itHandlesResignWhenMyMove({ messageState, gameState});
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
        const action = actions.positionReceived(acceptBLow);
        const gameState2 = { ...gameState, balances: bLowFundsBalances, latestPosition: proposeBLow };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(revealInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
        itsPropertiesAreConsistentWithItsPosition(updatedState);
      });
    });

    itHandlesResignWhenTheirMove({ messageState, gameState});
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

    itHandlesResignWhenTheirMove({ messageState, gameState});
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
      balances: insufficientFundsBalances,
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
      balances: aWinsBalances,
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
      balances: aWinsBalances,
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
