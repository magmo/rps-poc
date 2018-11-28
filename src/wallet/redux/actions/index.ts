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
  data,
});
export type OwnPositionReceived = ReturnType<typeof ownPositionReceived>;

export const OPPONENT_POSITION_RECEIVED = 'WALLET.OPPONENT_POSITION_RECEIVED';
export const opponentPositionReceived = (data: string, signature: string) => ({
  type: OPPONENT_POSITION_RECEIVED as typeof OPPONENT_POSITION_RECEIVED,
  data,
  signature,
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

export const APPROVE_CHALLENGE = 'WALLET.APPROVE_CHALLENGE';
export const approveChallenge = () => ({
  type: APPROVE_CHALLENGE,
});
export type ApproveChallenge = ReturnType<typeof approveChallenge>;

export const DECLINE_CHALLENGE = 'WALLET.DECLINE_CHALLENGE';
export const declineChallenge = () => ({
  type: DECLINE_CHALLENGE,
});
export type DeclineChallenge = ReturnType<typeof declineChallenge>;

export const CHALLENGE_REQUESTED = 'WALLET.CHALLENGE_REQUESTED';
export const challengeRequested = () => ({
  type: CHALLENGE_REQUESTED,
});
export type ChallengeRequested = ReturnType<typeof challengeRequested>;

export const CHALLENGE_INITIATED = 'WALLET.CHALLENGE_INITIATED';
export const challengeInitiated = () => ({
  type: CHALLENGE_INITIATED,
});
export type ChallengeInitiated = ReturnType<typeof challengeInitiated>;

export const CHALLENGE_SUBMITTED = 'WALLET.CHALLENGE_SUBMITTED';
export const challengeSubmitted = () => ({
  type: CHALLENGE_SUBMITTED,
});
export type ChallengeSubmitted = ReturnType<typeof challengeSubmitted>;


export const CHALLENGE_CONFIRMED = 'WALLET.CHALLENGE_CONFIRMED';
export const challengeConfirmed = () => ({
  type: CHALLENGE_CONFIRMED,
});
export type ChallengeConfirmed = ReturnType<typeof challengeConfirmed>;

// TODO: Decide if we want to implement this
// export const CHALLENGE_FINALIZED = 'WALLET.CHALLENGE_FINALIZED';

export const OPPONENT_CHALLENGE_DETECTED = 'WALLET.OPPONENT_CHALLENGE_DETECTED';
export const opponentChallengeDetected = (challengeExpiry: Date) => ({
  type: OPPONENT_CHALLENGE_DETECTED,
  challengeExpiry,
});
export type OpponentChallengeDetected = ReturnType<typeof opponentChallengeDetected>;

// TODO: Decide if we want to implement this
// export const OPPONENT_CHALLENGE_FINALISED = '.';

export const CHALLENGE_RESPONSE_RECEIVED = 'WALLET.CHALLENGE_RESPONSE_RECEIVED';
export const challengeResponseReceived = (position: string) => ({
  type: CHALLENGE_RESPONSE_RECEIVED,
  position,
});
export type ChallengeResponseReceived = ReturnType<typeof challengeResponseReceived>;

export const CHALLENGE_TIMEOUT = 'WALLET.CHALLENGE_TIMEOUT';
export const challengeTimeout = () => ({
  type: CHALLENGE_TIMEOUT,
});
export type ChallengeTimeout = ReturnType<typeof challengeTimeout>;

export const ACKNOWLEDGE_CHALLENGE_TIMEOUT = 'WALLET.ACKNOWLEDGE_CHALLENGE_TIMEOUT';
export const acknowledgeChallengeTimeout = () => ({
  type: ACKNOWLEDGE_CHALLENGE_TIMEOUT,
});
export type AcknowledgeChallengeTimeout = ReturnType<typeof acknowledgeChallengeTimeout>;

export const ACKNOWLEDGE_CHALLENGE_RESPONSE = 'WALLET.ACKNOWLEDGE_CHALLENGE_RESPONSE';
export const acknowledgeChallengeResponse = () => ({
  type: ACKNOWLEDGE_CHALLENGE_RESPONSE,
});
export type AcknowledgeChallengeResponse = ReturnType<typeof acknowledgeChallengeResponse>;

export const ACKNOWLEDGE_CHALLENGE = 'WALLET.ACKNOWLEDGE_CHALLENGE';
export const acknowledgeChallenge = () => ({
  type: ACKNOWLEDGE_CHALLENGE,
});
export type AcknowledgeChallenge = ReturnType<typeof acknowledgeChallenge>;

export const SELECT_RESPOND_WITH_MOVE = 'WALLET.SELECT_RESPOND_WITH_MOVE';
export const selectRespondWithMove = () => ({
  type: SELECT_RESPOND_WITH_MOVE,
});
export type SelectRespondWithMove = ReturnType<typeof selectRespondWithMove>;

export const SELECT_RESPOND_WITH_REFUTE = 'WALLET.SELECT_RESPOND_WITH_REFUTE';
export const selectRespondWithRefute = () => ({
  type: SELECT_RESPOND_WITH_REFUTE,
});
export type SelectRespondWithRefute = ReturnType<typeof selectRespondWithRefute>;

export const CHALLENGE_RESPONSE_INITIATED = 'WALLET.CHALLENGE_RESPONSE_INITIATED';
export const challengeResponseInitiated = () => ({
  type: CHALLENGE_RESPONSE_INITIATED,
});
export type ChallengeResponseInitiated = ReturnType<typeof challengeResponseInitiated>;


export const CHALLENGE_RESPONSE_SUBMITTED = 'WALLET.CHALLENGE_RESPONSE_SUBMITTED';
export const challengeResponseSubmitted = () => ({
  type: CHALLENGE_RESPONSE_SUBMITTED,
});
export type ChallengeResponseSubmitted = ReturnType<typeof challengeResponseSubmitted>;

export const CHALLENGE_RESPONSE_CONFIRMED = 'WALLET.CHALLENGE_RESPONSE_CONFIRMED';
export const challengeResponseConfirmed = () => ({
  type: CHALLENGE_RESPONSE_CONFIRMED,
});
export type ChallengeResponseConfirmed = ReturnType<typeof challengeResponseConfirmed>;

export const TAKE_MOVE_IN_APP = 'WALLET.TAKE_MOVE_IN_APP';
export const takeMoveInApp = (position: string) => ({
  type: TAKE_MOVE_IN_APP,
  position,
});
export type TakeMoveInApp = ReturnType<typeof takeMoveInApp>;

export const ACKNOWLEDGE_CHALLENGE_COMPLETE = 'WALLET.ACKNOWLEDGE_CHALLENGE_COMPLETE';
export const acknowledgeChallengeComplete = () => ({
  type: ACKNOWLEDGE_CHALLENGE_COMPLETE,
});
export type AcknowledgeChallengeComplete = ReturnType<typeof acknowledgeChallengeComplete>;


export const WITHDRAWAL_REQUESTED = '.';
export const WITHDRAWAL_INTITIATED = '.'; // when sent to metamask
export const WITHDRAWAL_SUBMITTED = '.';
export const WITHDRAWAL_CONFIRMED = '.';
export const WITHDRAWAL_FINALISED = '.';

export type WalletAction = (
  | LoggedIn
  | KeysLoaded
  | OpponentPositionReceived
  | ChallengeRequested
  | OpponentChallengeDetected
  | ChallengeRequested
  | ChallengeConfirmed
  | ChallengeResponseReceived
  | ChallengeResponseInitiated
  | ChallengeResponseSubmitted
  | ChallengeResponseConfirmed
  | ChallengeTimeout
  | TakeMoveInApp
);
