import BN from 'bn.js';
import { Move, Position, positions } from '../../core';

export const CREATE_GAME = 'GAME.CREATE_GAME';
export const INITIAL_POSITION_RECEIVED = 'GAME.INITIAL_POSITION_RECEIVED';
export const CONFIRM_GAME = 'GAME.CONFIRM_GAME';
export const CHOOSE_MOVE = 'GAME.CHOOSE_MOVE';
export const PLAY_AGAIN = 'GAME.PLAY_AGAIN';
export const RESIGN = 'GAME.RESIGN';
export const POSITION_RECEIVED = 'GAME.POSITION_RECEIVED';
export const FUNDING_SUCCESS = 'GAME.FUNDING_SUCCESS';
export const WITHDRAWAL_REQUEST = 'GAME.WITHDRAWAL_REQUEST';
export const WITHDRAWAL_SUCCESS = 'GAME.WITHDRAWAL_SUCCESS';
export const ENTER_WAITING_ROOM = 'GAME.ENTER_WAITING_ROOM';
export const ENTER_LOBBY = 'GAME.ENTER_LOBBY';
export const MESSAGE_SENT = 'GAME.MESSAGE_SENT';

export const createGame = (
  myName: string,
  myAddress: string,
  opponentName: string,
  opponentAddress: string,
  libraryAddress: string,
  channelNonce: number,
  roundBuyIn: BN,
) => ({
  type: CREATE_GAME as typeof CREATE_GAME,
  myName,
  myAddress,
  opponentName,
  opponentAddress,
  libraryAddress,
  channelNonce,
  roundBuyIn,
});

export const initialPositionReceived = (position: positions.PreFundSetupA, myName: string, opponentName: string) => ({
  type: INITIAL_POSITION_RECEIVED as typeof INITIAL_POSITION_RECEIVED,
  position,
  myName,
  opponentName,
});

export const confirmGame = () => ({
  type: CONFIRM_GAME as typeof CONFIRM_GAME,
});

export const chooseMove = (move: Move) => ({
  type: CHOOSE_MOVE as typeof CHOOSE_MOVE,
  move,
});

export const playAgain = () => ({
  type: PLAY_AGAIN as typeof PLAY_AGAIN,
});

export const resign = () => ({
  type: RESIGN as typeof RESIGN,
});

export const positionReceived = (position: Position) => ({
  type: POSITION_RECEIVED as typeof POSITION_RECEIVED,
  position,
});

export const fundingSuccess = () => ({
  type: FUNDING_SUCCESS as typeof FUNDING_SUCCESS,
});

export const withdrawalRequest = () => ({
  type: WITHDRAWAL_REQUEST as typeof WITHDRAWAL_REQUEST,
});

export const withdrawalSuccess = () => ({
  type: WITHDRAWAL_SUCCESS as typeof WITHDRAWAL_SUCCESS,
});

export const enterWaitingRoom = (myName: string, roundBuyIn: BN) => ({
  type: ENTER_WAITING_ROOM as typeof ENTER_WAITING_ROOM,
  myName,
  roundBuyIn,
});

export const enterLobby = (myName: string) => ({
  type: ENTER_LOBBY as typeof ENTER_LOBBY,
  myName,
});

// TODO: Should this be moved?
export const messageSent = ()=>({
  type: MESSAGE_SENT as typeof MESSAGE_SENT,
});

export type InitialPositionReceived = ReturnType<typeof initialPositionReceived>;
export type CreateGame = ReturnType<typeof createGame>;
export type ConfirmGame = ReturnType<typeof confirmGame>;
export type ChooseMove = ReturnType<typeof chooseMove>;
export type PlayAgain = ReturnType<typeof playAgain>;
export type Resign = ReturnType<typeof resign>;
export type PositionReceived = ReturnType<typeof positionReceived>;
export type FundingSuccess = ReturnType<typeof fundingSuccess>;
export type WithdrawalSuccess = ReturnType<typeof withdrawalSuccess>;
export type WithdrawalRequest = ReturnType<typeof withdrawalRequest>;
export type EnterWaitingRoom = ReturnType<typeof enterWaitingRoom>;
export type EnterLobby = ReturnType<typeof enterLobby>;
export type MessageSent = ReturnType<typeof messageSent>;

export type GameAction = (
  | ConfirmGame
  | ChooseMove
  | PlayAgain
  | PositionReceived
  | FundingSuccess
  | WithdrawalSuccess
  | WithdrawalRequest
  | Resign
  | InitialPositionReceived
  | CreateGame
  | EnterWaitingRoom
  | EnterLobby
  | MessageSent
);
