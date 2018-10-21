import BN from 'bn.js';
import { Position, Result, Move, Player } from '../../core';

// States of the form *A are player A only
// States of the form *B are player B only
// All other states are both players
export enum StateName {
  NotStarted = 'NotStarted',
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

interface TwoChannel {
  libraryAddress: string;
  channelNonce: number;
  participants: [string, string];
}

interface Base extends TwoChannel {
  turnNum: number;
  balances: [BN, BN];
  stateCount: number;
  roundBuyIn: BN;
  myName: string;
  opponentName: string;
}

interface IncludesBase extends Base {
  [x: string]: any;
}

export function base(state: IncludesBase) {
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
    player,
  };
}

export interface NotStarted {
  name: StateName.NotStarted;
}

export interface WaitForGameConfirmationA extends Base {
  name: StateName.WaitForGameConfirmationA;
  player: Player.PlayerA;
}
export function waitForGameConfirmationA(state: IncludesBase): WaitForGameConfirmationA {
  return { ...base(state), name: StateName.WaitForGameConfirmationA, player: Player.PlayerA };
}

export interface ConfirmGameB extends Base {
  name: StateName.ConfirmGameB;
  player: Player.PlayerB;
}
export function confirmGameB(state: IncludesBase): ConfirmGameB {
  return { ...base(state), name: StateName.ConfirmGameB, player: Player.PlayerB };
}

export interface WaitForFunding extends Base {
  name: StateName.WaitForFunding;
  player: Player;
}
export function waitForFunding(state: IncludesBase): WaitForFunding {
  return { ...base(state), name: StateName.WaitForFunding };
}

export interface WaitForPostFundSetup extends Base {
  name: StateName.WaitForPostFundSetup;
  player: Player;
}
export function waitForPostFundSetup(state: IncludesBase): WaitForPostFundSetup {
  return { ...base(state), name: StateName.WaitForPostFundSetup };
}

export interface PickMove extends Base {
  name: StateName.PickMove;
  player: Player;
}
export function pickMove(state: IncludesBase): PickMove {
  return { ...base(state), name: StateName.PickMove };
}

export interface WaitForOpponentToPickMoveA extends Base {
  name: StateName.WaitForOpponentToPickMoveA;
  myMove: Move;
  salt: string;
  player: Player.PlayerA;
}
interface IncludesMove extends IncludesBase {
  myMove: Move;
}

interface IncludesMoveAndSalt extends IncludesMove {
  salt: string;
}
export function waitForOpponentToPickMoveA(state: IncludesMoveAndSalt): WaitForOpponentToPickMoveA {
  return {
    ...base(state),
    name: StateName.WaitForOpponentToPickMoveA,
    myMove: state.myMove,
    salt: state.salt,
  };
}

export interface WaitForOpponentToPickMoveB extends Base {
  name: StateName.WaitForOpponentToPickMoveB;
  myMove: Move;
  player: Player.PlayerB;
}
export function waitForOpponentToPickMoveB(state: IncludesMove): WaitForOpponentToPickMoveB {
  return {
    ...base(state),
    name: StateName.WaitForOpponentToPickMoveB,
    myMove: state.myMove,
  };
}

export interface WaitForRevealB extends Base {
  name: StateName.WaitForRevealB;
  myMove: Move;
  player: Player.PlayerB;
}
export function waitForRevealB(state: IncludesMove): WaitForRevealB {
  return {
    ...base(state),
    name: StateName.WaitForRevealB,
    myMove: state.myMove,
  };
}

interface IncludesResult extends IncludesBase {
  myMove: Move;
  theirMove: Move;
  result: Result;
}

export interface PlayAgain extends Base {
  name: StateName.PlayAgain;
  myMove: Move;
  theirMove: Move;
  result: Result;
  player: Player;
}
export function playAgain(state: IncludesResult): PlayAgain {
  const { myMove, theirMove, result } = state;
  return { ...base(state), name: StateName.PlayAgain, myMove, theirMove, result };
}

export interface WaitForRestingA extends Base {
  name: StateName.WaitForRestingA;
  myMove: Move;
  theirMove: Move;
  result: Result;
  player: Player.PlayerA;
}
export function waitForRestingA(state: IncludesResult): WaitForRestingA {
  const { myMove, theirMove, result } = state;
  return { ...base(state), name: StateName.WaitForRestingA, myMove, theirMove, result };
}

export interface InsufficientFunds extends Base {
  name: StateName.InsufficientFunds;
  myMove: Move;
  theirMove: Move;
  result: Result;
  player: Player;
}
export function insufficientFunds(state: IncludesResult): InsufficientFunds {
  const { myMove, theirMove, result } = state;
  return { ...base(state), name: StateName.InsufficientFunds, myMove, theirMove, result };
}

export interface WaitToResign extends Base {
  name: StateName.WaitToResign;
  player: Player;
}
export function waitToResign(state: IncludesBase): WaitToResign {
  return { ...base(state), name: StateName.WaitToResign };
}

export interface OpponentResigned extends Base {
  name: StateName.OpponentResigned;
  player: Player;
}
export function opponentResigned(state: IncludesBase): OpponentResigned {
  return { ...base(state), name: StateName.OpponentResigned };
}

export interface WaitForResignationAcknowledgement extends Base {
  name: StateName.WaitForResignationAcknowledgement;
  player: Player;
}
export function waitForResignationAcknowledgement(state: IncludesBase): WaitForResignationAcknowledgement {
  return { ...base(state), name: StateName.WaitForResignationAcknowledgement };
}

export interface GameOver extends Base {
  name: StateName.GameOver;
  player: Player;
}
export function gameOver(state: IncludesBase): GameOver {
  return { ...base(state), name: StateName.GameOver };
}

export interface WaitForWithdrawal extends Base {
  name: StateName.WaitForWithdrawal;
  player: Player;
}
export function waitForWithdrawal(state: IncludesBase): WaitForWithdrawal {
  return { ...base(state), name: StateName.WaitForWithdrawal };
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
