export const SHOW_WAITING_SCREEN = 'CHALLENGE.WAITING_SCREEN.SHOW';
export const CLOSE_WAITING_SCREEN = 'CHALLENGE.WAITING_SCREEN.CLOSE';

export const SHOW_RESPONSE_SCREEN = 'CHALLENGE.RESPONSE_SCREEN.SHOW';
export const CLOSE_RESPONSE_SCREEN = 'CHALLENGE.RESPONSE_SCREEN.CLOSE';

export const showWaitingScreen = (expirationTime) => ({
  type: SHOW_WAITING_SCREEN as typeof SHOW_WAITING_SCREEN,
  expirationTime,
});
export const closeWaitingScreen = () => ({
  type: CLOSE_WAITING_SCREEN as typeof CLOSE_WAITING_SCREEN,
});

export const showResponseScreen = (responseOptions: ResponseOption[], expirationTime) => ({
  type: SHOW_RESPONSE_SCREEN as typeof SHOW_RESPONSE_SCREEN,
  responseOptions,
  expirationTime,
});
export const closeResponseScreen = () => ({
  type: CLOSE_RESPONSE_SCREEN as typeof CLOSE_RESPONSE_SCREEN,
});

export type ShowWaitingScreen = ReturnType<typeof showWaitingScreen>;
export type CloseWaitingScreen = ReturnType<typeof closeWaitingScreen>;

export type ShowResponseScreen = ReturnType<typeof showResponseScreen>;
export type CloseResponseScreen = ReturnType<typeof closeResponseScreen>;

export enum ResponseOption {
  RespondWithMove,
  RespondWithAlternativeMove,
  Refute,
  Conclude,
}