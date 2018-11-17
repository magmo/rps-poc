
export const KEYS_LOADED = 'KEYS_LOADED';

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

export const OWN_POSITION_RECEIVED = '';
export const OPPONENT_POSITION_RECEIVED = '';

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
  | KeysLoaded
);
