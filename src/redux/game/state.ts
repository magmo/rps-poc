import BN from 'bn.js';
import { Position } from '../../game-engine/positions';

// States of the form *A are player A only
// States of the form *B are player B only
// All other states are both players
export enum StateName {
  WaitForGameConfirmationA = 'WAIT_FOR_GAME_CONFIRMATION_A',
  ConfirmGameB = 'CONFIRM_GAME_B',
  WaitForFunding = 'WAIT_FOR_FUNDING',
  WaitForPostFundSetup = 'WAIT_FOR_POST_FUND_SETUP',
  PickMove = 'PICK_MOVE',
  WaitForOpponentToPickMoveA = 'WAIT_FOR_OPPONENT_TO_PICK_MOVE_A',
  WaitForOpponentToPickMoveB = 'WAIT_FOR_OPPONENT_TO_PICK_MOVE_B',
  WaitForRevealB = 'WAIT_FOR_REVEAL_B',
  PlayAgain = 'PLAY_AGAIN',
  WaitForRestingA = 'WAIT_FOR_RESTING_A',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  WaitToResign = 'WAIT_TO_RESIGN',
  OpponentResigned = 'OPPONENT_RESIGNED',
  WaitForResignationAcknowledgement = 'WAIT_FOR_RESIGNATION_ACKNOWLEDGEMENT',
  GameOver = 'GAME_OVER',
  WaitForWithdrawal = 'WAIT_FOR_WITHDRAWAL',
}

export enum Player {
  A,
  B,
}

export enum Move {
  Rock,
  Paper,
  Scissors,
}

export enum Result {
  youWon,
  youLost,
  draw,
}

interface TwoChannel {
  libraryAddress: string;
  channelNonce: string;
  participants: [string, string];
}

interface Base extends TwoChannel {
  turnNum: number;
  balances: [BN, BN];
  stateCount: number;
  roundBuyIn: BN;
  myName: string;
  opponentName: string;
  latestPosition: Position;
}

export function baseProperties(state: GameState) {
  const {
    libraryAddress,
    channelNonce,
    participants,
    turnNum,
    balances,
    stateCount,
    roundBuyIn,
    myName,
    opponentName,
    latestPosition,
    player,
  } = state;

  return {
    libraryAddress,
    channelNonce,
    participants,
    turnNum,
    balances,
    stateCount,
    roundBuyIn,
    myName,
    opponentName,
    latestPosition,
    player,
  };
}

export interface WaitForGameConfirmationA extends Base {
  name: StateName.WaitForGameConfirmationA;
  player: Player.A;
}

export interface ConfirmGameB extends Base {
  name: StateName.ConfirmGameB;
  player: Player.B;
}

export interface WaitForFunding extends Base {
  name: StateName.WaitForFunding;
  player: Player;
}

export interface WaitForPostFundSetup extends Base {
  name: StateName.WaitForPostFundSetup;
  player: Player;
}

export interface PickMove extends Base {
  name: StateName.PickMove;
  player: Player;
}

export interface WaitForOpponentToPickMoveA extends Base {
  name: StateName.WaitForOpponentToPickMoveA;
  myMove: Move;
  salt: string;
  player: Player.A;
}

export interface WaitForOpponentToPickMoveB extends Base {
  name: StateName.WaitForOpponentToPickMoveB;
  myMove: Move;
  player: Player.B;
}

export interface WaitForRevealB extends Base {
  name: StateName.WaitForRevealB;
  myMove: Move;
  player: Player.B;
}

export interface PlayAgain extends Base {
  name: StateName.PlayAgain;
  myMove: Move;
  theirMove: Move;
  result: Result;
  player: Player;
}

export interface WaitForRestingA extends Base {
  name: StateName.WaitForRestingA;
  myMove: Move;
  player: Player.A;
}

export interface InsufficientFunds extends Base {
  name: StateName.InsufficientFunds;
  myMove: Move;
  theirMove: Move;
  result: Result;
  player: Player;
}

export interface WaitToResign extends Base {
  name: StateName.WaitToResign;
  player: Player;
}

export interface OpponentResigned extends Base {
  name: StateName.OpponentResigned;
  player: Player;
}

export interface WaitForResignationAcknowledgement extends Base {
  name: StateName.WaitForResignationAcknowledgement;
  player: Player;
}

export interface GameOver extends Base {
  name: StateName.GameOver;
  player: Player;
}

export interface WaitForWithdrawal extends Base {
  name: StateName.WaitForWithdrawal;
  player: Player;
}

export type GameState = (
  | WaitForGameConfirmationA
  | ConfirmGameB
  | WaitForFunding
  | WaitForPostFundSetup
  | PickMove
  | WaitForOpponentToPickMoveA
  | WaitForOpponentToPickMoveB
  | WaitForRevealB
  | PlayAgain
  | WaitForRestingA
  | InsufficientFunds
  | WaitToResign
  | OpponentResigned
  | WaitForResignationAcknowledgement
  | GameOver
  | WaitForWithdrawal
);

export function itsMyTurn(gameState: GameState) {
  const turnNum = gameState.turnNum;

  return gameState.player === Player.A ? turnNum % 2 === 0 : turnNum % 2 === 1;
}
