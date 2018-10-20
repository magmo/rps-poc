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
const addrPlayerA = '0x' + 'a'.repeat(40);
const addrPlayerB = '0x' + 'b'.repeat(40);
const participants: [string, string] = [addrPlayerA, addrPlayerB];
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

const nullMessageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

export const itSends = (position, jointState) => {
  it(`sends ${position.constructor.name}`, () => {
    expect(jointState.messageState.opponentOutbox).toEqual(position);
  });
};

export const itTransitionsTo = (stateName, jointState) => {
  it(`transitions to ${stateName}`, () => {
    expect(jointState.gameState.name).toEqual(stateName);
  });
};

export const itStoresAction = (action, jointState) => {
  it(`stores action to retry`, () => {
    expect(jointState.messageState.actionToRetry).toEqual(action);
  });
};

export const itsPropertiesAreConsistentWithItsPosition = (jointState) => {
  it(`updates its properties to be consistent with the latest position`, () => {
    const gameState = jointState.gameState;
    const position = gameState.latestPosition;
    expect(gameState.balances).toEqual(position.resolution);
    expect(gameState.turnNum).toEqual(position.turnNum);
  });
};

export const itHandlesResignWhenTheirTurn = (jointState: JointState) => {
  describe('when resigning on their turn', () => {
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

export const itHandlesResignWhenMyTurn = (jointState: JointState) => {
  describe('when resigning on my turn', () => {
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

export const itCanHandleTheOpponentResigning = ({ gameState, messageState }) => {
  const { turnNum, balances } = gameState.latestPosition;
  const isTheirTurn = gameState.player === Player.PlayerA ? turnNum % 2 === 0 : turnNum % 2 !== 0;
  const newTurnNum = isTheirTurn ? turnNum : turnNum + 1;
  const theirConclude = new Conclude(channel, newTurnNum, balances);
  const action = actions.opponentResigned(theirConclude);

  const updatedState = gameReducer({ gameState, messageState }, action);

  itTransitionsTo(state.StateName.OpponentResigned, updatedState);
  itSends(new Conclude(channel, newTurnNum + 1, balances), updatedState);
};

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
      itsPropertiesAreConsistentWithItsPosition(updatedState);
    });
  });
});