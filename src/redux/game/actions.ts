import { Move, Position, positions } from '../../core';

export const UPDATE_PROFILE = 'LOGIN.UPDATE_PROFILE';
export const JOIN_OPEN_GAME = 'GAME.JOIN_OPEN_GAME';
export const NEW_OPEN_GAME = 'GAME.NEW_OPEN_GAME';
export const CREATE_OPEN_GAME = 'GAME.CREATE_OPEN_GAME';
export const CANCEL_OPEN_GAME = 'GAME.CANCEL_OPEN_GAME';
export const INITIAL_POSITION_RECEIVED = 'GAME.INITIAL_POSITION_RECEIVED';
export const CONFIRM_GAME = 'GAME.CONFIRM_GAME';
export const DECLINE_GAME = 'GAME.DECLINE_GAME';
export const CHOOSE_MOVE = 'GAME.CHOOSE_MOVE';
export const PLAY_AGAIN = 'GAME.PLAY_AGAIN';
export const RESIGN = 'GAME.RESIGN';
export const POSITION_RECEIVED = 'GAME.POSITION_RECEIVED';
export const FUNDING_SUCCESS = 'GAME.FUNDING_SUCCESS';
export const FUNDING_FAILURE = 'GAME.FUNDING_FAILURE';
export const WITHDRAWAL_REQUEST = 'GAME.WITHDRAWAL_REQUEST';
export const WITHDRAWAL_SUCCESS = 'GAME.WITHDRAWAL_SUCCESS';
export const EXIT_TO_LOBBY = 'GAME.EXIT_TO_LOBBY';
export const MESSAGE_SENT = 'GAME.MESSAGE_SENT';

export const updateProfile = (name: string, twitterHandle: string) => ({
  type: UPDATE_PROFILE as typeof UPDATE_PROFILE,
  name,
  twitterHandle,
});

export const newOpenGame = () => ({
  type: NEW_OPEN_GAME as typeof NEW_OPEN_GAME,
});

export const cancelOpenGame = () => ({
  type: CANCEL_OPEN_GAME as typeof CANCEL_OPEN_GAME,
});

export const joinOpenGame = (
  opponentName: string,
  opponentAddress: string,
  channelNonce: number,
  roundBuyIn: string,
) => ({
  type: JOIN_OPEN_GAME as typeof JOIN_OPEN_GAME,
  opponentName,
  opponentAddress,
  channelNonce,
  roundBuyIn,
});

export const initialPositionReceived = (position: positions.PreFundSetupA, opponentName: string) => ({
  type: INITIAL_POSITION_RECEIVED as typeof INITIAL_POSITION_RECEIVED,
  position,
  opponentName,
});

export const confirmGame = () => ({
  type: CONFIRM_GAME as typeof CONFIRM_GAME,
});
export const declineGame = () => ({
  type: DECLINE_GAME as typeof DECLINE_GAME,
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

export const fundingFailure = () => ({
  type: FUNDING_FAILURE as typeof FUNDING_FAILURE,
});


export const withdrawalRequest = () => ({
  type: WITHDRAWAL_REQUEST as typeof WITHDRAWAL_REQUEST,
});

export const withdrawalSuccess = () => ({
  type: WITHDRAWAL_SUCCESS as typeof WITHDRAWAL_SUCCESS,
});

export const createOpenGame = (roundBuyIn: string) => ({
  type: CREATE_OPEN_GAME as typeof CREATE_OPEN_GAME,
  roundBuyIn,
});

export const exitToLobby = () => ({
  type: EXIT_TO_LOBBY as typeof EXIT_TO_LOBBY,
});

// TODO: Should this be moved?
export const messageSent = () => ({
  type: MESSAGE_SENT as typeof MESSAGE_SENT,
});

export type InitialPositionReceived = ReturnType<typeof initialPositionReceived>;
export type NewOpenGame = ReturnType<typeof newOpenGame>;
export type CancelOpenGame = ReturnType<typeof cancelOpenGame>;
export type JoinOpenGame = ReturnType<typeof joinOpenGame>;
export type ConfirmGame = ReturnType<typeof confirmGame>;
export type DeclineGame = ReturnType<typeof declineGame>;
export type ChooseMove = ReturnType<typeof chooseMove>;
export type PlayAgain = ReturnType<typeof playAgain>;
export type Resign = ReturnType<typeof resign>;
export type PositionReceived = ReturnType<typeof positionReceived>;
export type FundingSuccess = ReturnType<typeof fundingSuccess>;
export type FundingFailure = ReturnType<typeof fundingFailure>;
export type WithdrawalSuccess = ReturnType<typeof withdrawalSuccess>;
export type WithdrawalRequest = ReturnType<typeof withdrawalRequest>;
export type CreateOpenGame = ReturnType<typeof createOpenGame>;
export type ExitToLobby = ReturnType<typeof exitToLobby>;
export type UpdateProfile = ReturnType<typeof updateProfile>;
export type MessageSent = ReturnType<typeof messageSent>;

export type GameAction = (
  | UpdateProfile
  | NewOpenGame
  | CancelOpenGame
  | CreateOpenGame
  | ConfirmGame
  | DeclineGame
  | JoinOpenGame
  | ChooseMove
  | PlayAgain
  | PositionReceived
  | FundingSuccess
  | FundingFailure
  | WithdrawalSuccess
  | WithdrawalRequest
  | Resign
  | InitialPositionReceived
  | ExitToLobby
  | MessageSent
);
