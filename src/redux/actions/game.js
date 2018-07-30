export const types = Object.freeze({
  PROPOSE_GAME: 'PROPOSE_GAME',
  CHOOSE_A_PLAY: 'CHOOSE_A_PLAY',
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  EVENT_RECEIVED: 'EVENT_RECEIVED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  STATE_TRANSITIONED: 'STATE_TRANSITIONED',
});

export const stateTransitioned = (state) => ({
  type: types.STATE_TRANSITIONED,
  state,
});

export const proposeGame = (opponentAddress) => ({
  type: types.PROPOSE_GAME,
  opponentAddress,
});

export const chooseAPlay = (aPlay) => ({
  type: types.CHOOSE_A_PLAY,
  aPlay,
});

export const messageReceived = (message) => ({
  type: types.MESSAGE_RECEIVED,
  message,
});

export const messageSent = (message) => ({
  type: types.MESSAGE_SENT,
  message,
});

export const eventReceived = (event) => ({
  type: types.EVENT_RECEIVED,
  event,
});
