export const LOGGED_IN = 'WALLET.LOGGED_IN';
export const loggedIn = (uid: string) => ({
  type: LOGGED_IN as typeof LOGGED_IN,
  uid,
});
export type LoggedIn = ReturnType<typeof loggedIn>;

export const KEYS_LOADED = 'WALLET.KEYS_LOADED';
export const keysLoaded = (address: string, privateKey: string) => ({
  type: KEYS_LOADED as typeof KEYS_LOADED,
  address,
  privateKey,
});
export type KeysLoaded = ReturnType<typeof keysLoaded>;

export const CREATE_CHANNEL_REQUEST = ''; // send over opponent addresses, gameLibrary
                                          // return nonce etc.
export const JOIN_CHANNEL_REQUEST = '';
export const ADDRESS_REQUEST = ''; // provide me with an address

export const OWN_POSITION_RECEIVED = 'WALLET.OWN_POSITION_RECEIVED';
export const ownPositionReceived = (data: string) => ({
  type: OWN_POSITION_RECEIVED as typeof OWN_POSITION_RECEIVED,
  data
});
export type OwnPositionReceived = ReturnType<typeof ownPositionReceived>;

export const OPPONENT_POSITION_RECEIVED = 'WALLET.OPPONENT_POSITION_RECEIVED';
export const opponentPositionReceived = (data: string, signature: string) => ({
  type: OPPONENT_POSITION_RECEIVED as typeof OPPONENT_POSITION_RECEIVED,
  data
});
export type OpponentPositionReceived = ReturnType<typeof opponentPositionReceived>;

export const FUNDING_REQUESTED = '.';
export const FUNDING_APPROVED = '.';
export const FUNDING_CANCELLED = '.';

export const DEPLOYMENT_INITIATED = '.'; // when sent to metamask
export const DEPLOYMENT_SUBMITTED = '.'; // when submitted to network
export const DEPLOYMENT_CONFIRMED = '.'; // when first seen in a block
export const DEPLOYMENT_FINALISED = '.'; // when X blocks deep

export const DEPOSIT_INITIATED = '.'; // when sent to metamask
export const DEPOSIT_SUBMITTED = '.'; // when submitted to network
export const DEPOSIT_CONFIRMED = '.'; // when first seen in a block
export const DEPOSIT_FINALISED = '.'; // when X blocks deep

export const CHALLENGE_INITIATED = '.';
export const CHALLENGE_SUBMITTED = '.';
export const CHALLENGE_CONFIRMED = '.';
export const CHALLENGE_FINALISED = '.';

export const OPPONENT_CHALLENGE_DETECTED = '.';
export const OPPONENT_CHALLENGE_FINALISED = '.';

export const CHALLENGE_RESPONSE_INITIATED = '.';
export const CHALLENGE_RESPONSE_SUBMITTED = '.';
export const CHALLENGE_RESPONSE_CONFIRMED = '.';
export const CHALLENGE_RESPONSE_FINALISED = '.';

export const WITHDRAWAL_REQUESTED = '.';
export const WITHDRAWAL_INTITIATED = '.'; // when sent to metamask
export const WITHDRAWAL_SUBMITTED = '.';
export const WITHDRAWAL_CONFIRMED = '.';
export const WITHDRAWAL_FINALISED = '.';

export type WalletAction = (
  | LoggedIn
  | KeysLoaded
);
