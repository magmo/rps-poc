import BN from 'bn.js';
import { Move, Position, positions } from '../../core';

export const CREATE_GAME = 'GAME.CREATE_GAME';
export const ACCEPT_GAME = 'GAME.ACCEPT_GAME';
export const CONFIRM_GAME = 'GAME.CONFIRM_GAME';
export const CHOOSE_PLAY = 'GAME.CHOOSE_PLAY';
export const PLAY_AGAIN = 'GAME.PLAY_AGAIN';
export const RESIGN = 'GAME.RESIGN';
export const POSITION_RECEIVED = 'GAME.POSITION_RECEIVED';
export const OPPONENT_RESIGNED = 'GAME.OPPONENT_RESIGNED';
export const FUNDING_SUCCESS = 'GAME.FUNDING_SUCCESS';
export const WITHDRAWAL_REQUEST = 'GAME.WITHDRAWAL_REQUEST';
export const WITHDRAWAL_SUCCESS = 'GAME.WITHDRAWAL_SUCCESS';

export const createGame = (
  myName: string,
  myAddress: string,
  opponentName: string,
  opponentAddress: string,
  libraryAddress: string,
  channelNonce: number,
  roundBuyIn: BN,
) => ({
  type: CREATE_GAME as typeof ACCEPT_GAME,
  myName,
  myAddress,
  opponentName,
  opponentAddress,
  libraryAddress,
  channelNonce,
  roundBuyIn,
});

export const acceptGame = (
  myName: string,
  myAddress: string,
  opponentName: string,
  opponentAddress: string,
  libraryAddress: string,
  channelNonce: number,
  roundBuyIn: BN,
) => ({
  type: ACCEPT_GAME as typeof ACCEPT_GAME,
  myName,
  myAddress,
  opponentName,
  opponentAddress,
  libraryAddress,
  channelNonce,
  roundBuyIn,
});

export const confirmGame = () => ({
  type: CONFIRM_GAME as typeof CONFIRM_GAME,
});

export const choosePlay = (play: Move) => ({
  type: CHOOSE_PLAY as typeof CHOOSE_PLAY,
  play,
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

export const opponentResigned = (position: positions.Conclude) => ({
  type: OPPONENT_RESIGNED as typeof OPPONENT_RESIGNED,
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

export type AcceptGame = ReturnType<typeof acceptGame>;
export type CreateGame = ReturnType<typeof createGame>;
export type ConfirmGame = ReturnType<typeof confirmGame>;
export type ChoosePlay = ReturnType<typeof choosePlay>;
export type MoveAgain = ReturnType<typeof playAgain>;
export type Resign = ReturnType<typeof resign>;
export type PositionReceived = ReturnType<typeof positionReceived>;
export type OpponentResigned = ReturnType<typeof opponentResigned>;
export type FundingSuccess = ReturnType<typeof fundingSuccess>;
export type WithdrawalSuccess = ReturnType<typeof withdrawalSuccess>;
export type WithdrawalRequest = ReturnType<typeof withdrawalRequest>;

export type StartAction = AcceptGame | CreateGame;
export type LocalAction = (
  | ConfirmGame
  | ChoosePlay
  | MoveAgain
  | PositionReceived
  | FundingSuccess
  | WithdrawalSuccess
  | WithdrawalRequest
);
export type ResignAction = Resign | OpponentResigned;

export type GameAction = (StartAction | LocalAction | ResignAction);
