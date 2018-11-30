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

export const FUNDING_APPROVED = 'WALLET.FUNDING_APPROVED';
export const fundingApproved = () => ({
  type: FUNDING_APPROVED as typeof FUNDING_APPROVED,
});
export type FundingApproved = ReturnType<typeof fundingApproved>;

export const FUNDING_CANCELLED = '.';

export const DEPLOY_INITIATED = 'WALLET.DEPLOY_INITIATED'; // when sent to metamask
export const deployInitiated = () => ({
  type: DEPLOY_INITIATED as typeof DEPLOY_INITIATED,
});
export type DeployInitiated = ReturnType<typeof deployInitiated>;

export const DEPLOY_SUBMITTED = 'WALLET.DEPLOY_SUBMITTED'; // when submitted to network
export const deploySubmitted = (adjudicator: string) => ({
  type: DEPLOY_SUBMITTED as typeof DEPLOY_SUBMITTED,
  adjudicator,
});
export type DeploySubmitted = ReturnType<typeof deploySubmitted>;

export const DEPLOY_CONFIRMED = '.'; // when first seen in a block

export const DEPLOY_FINALISED = 'WALLET.DEPLOY_FINALISED'; // when X blocks deep
export const deployFinalised = () => ({
  type: DEPLOY_FINALISED as typeof DEPLOY_FINALISED,
});
export type DeployFinalised = ReturnType<typeof deployFinalised>;

export const DEPOSIT_INITIATED = 'WALLET.DEPOSIT_INITIATED'; // when sent to metamask
export const depositInitiated = () => ({
  type: DEPOSIT_INITIATED as typeof DEPOSIT_INITIATED,
});
export type DepositInitiated = ReturnType<typeof depositInitiated>;


export const DEPOSIT_SUBMITTED = '.'; // when submitted to network
export const DEPOSIT_CONFIRMED = '.'; // when first seen in a block

export const DEPOSIT_FINALISED = 'WALLET.DEPOSIT_FINALISED'; // when X blocks deep
export const depositFinalised = () => ({
  type: DEPOSIT_FINALISED as typeof DEPOSIT_FINALISED,
});
export type DepositFinalised = ReturnType<typeof depositFinalised>;

export const FUNDING_SUCCESS_ACKNOWLEDGED = 'WALLET.FUNDING_SUCCESS_ACKNOWLEDGED';
export const fundingSuccessAcknowledged = () => ({
  type: FUNDING_SUCCESS_ACKNOWLEDGED as typeof FUNDING_SUCCESS_ACKNOWLEDGED,
});
export type FundingSuccessAcknowledged = ReturnType<typeof fundingSuccessAcknowledged>;


export const POST_FUND_SETUP_RECEIVED = 'WALLET.POST_FUND_SETUP_RECEIVED'; // when X blocks deep
export const postFundSetupReceived = (data: string, signature: string) => ({
  type: POST_FUND_SETUP_RECEIVED as typeof POST_FUND_SETUP_RECEIVED,
  data,
  signature,
});
export type PostFundSetupReceived = ReturnType<typeof postFundSetupReceived>;

export const CHALLENGE_APPROVED = 'WALLET.CHALLENGE_APPROVED';
export const challengeApproved = () => ({
  type: CHALLENGE_APPROVED as typeof CHALLENGE_APPROVED,
});
export type ChallengeApproved = ReturnType<typeof challengeApproved>;

export const CHALLENGE_REJECTED = 'WALLET.CHALLENGE_REJECTED';
export const challengeRejected = () => ({
  type: CHALLENGE_REJECTED as typeof CHALLENGE_REJECTED,
});
export type ChallengeRejected = ReturnType<typeof challengeRejected>;

export const CHALLENGE_REQUESTED = 'WALLET.CHALLENGE_REQUESTED';
export const challengeRequested = () => ({
  type: CHALLENGE_REQUESTED as typeof CHALLENGE_REQUESTED,
});
export type ChallengeRequested = ReturnType<typeof challengeRequested>;

export const OPPONENT_CHALLENGE_DETECTED = 'WALLET.OPPONENT_CHALLENGE_DETECTED';
export const opponentChallengeDetected = (challengeExpiry: Date) => ({
  type: OPPONENT_CHALLENGE_DETECTED as typeof OPPONENT_CHALLENGE_DETECTED,
  challengeExpiry,
});
export type OpponentChallengeDetected = ReturnType<typeof opponentChallengeDetected>;

export const CHALLENGE_RESPONSE_RECEIVED = 'WALLET.CHALLENGE_RESPONSE_RECEIVED';
export const challengeResponseReceived = (data: string) => ({
  type: CHALLENGE_RESPONSE_RECEIVED as typeof CHALLENGE_RESPONSE_RECEIVED,
  data,
});
export type ChallengeResponseReceived = ReturnType<typeof challengeResponseReceived>;

export const CHALLENGE_TIMED_OUT = 'WALLET.CHALLENGE_TIMED_OUT';
export const challengedTimedOut = () => ({
  type: CHALLENGE_TIMED_OUT as typeof CHALLENGE_TIMED_OUT,
});
export type ChallengedTimedOut = ReturnType<typeof challengedTimedOut>;

export const CHALLENGE_TIME_OUT_ACKNOWLEDGED = 'WALLET.CHALLENGE_TIME_OUT_ACKNOWLEDGED';
export const challengedTimedOutAcknowledged = () => ({
  type: CHALLENGE_TIME_OUT_ACKNOWLEDGED as typeof CHALLENGE_TIME_OUT_ACKNOWLEDGED,
});
export type ChallengeTimeoutAcknowledged = ReturnType<typeof challengedTimedOutAcknowledged>;

export const CHALLENGE_RESPONSE_ACKNOWLEDGED = 'WALLET.CHALLENGE_RESPONSE_ACKNOWLEDGED';
export const challengeResponseAcknowledged = () => ({
  type: CHALLENGE_RESPONSE_ACKNOWLEDGED as typeof CHALLENGE_RESPONSE_ACKNOWLEDGED,
});
export type ChallengeResponseAcknowledged = ReturnType<typeof challengeResponseAcknowledged>;

export const CHALLENGE_ACKNOWLEDGED = 'WALLET.CHALLENGE_ACKNOWLEDGED';
export const challengeAcknowledged = () => ({
  type: CHALLENGE_ACKNOWLEDGED as typeof CHALLENGE_ACKNOWLEDGED,
});
export type ChallengeAcknowledged = ReturnType<typeof challengeAcknowledged>;

export const RESPOND_WITH_EXISTING_MOVE_CHOSEN = 'WALLET.RESPOND_WITH_EXISTING_MOVE_CHOSEN';
export const respondWithExistingMoveChosen = () => ({
  type: RESPOND_WITH_EXISTING_MOVE_CHOSEN as typeof RESPOND_WITH_EXISTING_MOVE_CHOSEN,
});
export type RespondWithExistingMoveChosen = ReturnType<typeof respondWithExistingMoveChosen>;

export const RESPOND_WITH_MOVE_CHOSEN = 'WALLET.RESPOND_WITH_MOVE_CHOSEN';
export const respondWithMoveChosen = () => ({
  type: RESPOND_WITH_MOVE_CHOSEN as typeof RESPOND_WITH_MOVE_CHOSEN,
});
export type RespondWithMoveChosen = ReturnType<typeof respondWithMoveChosen>;

export const RESPOND_WITH_REFUTE_CHOSEN = 'WALLET.RESPOND_WITH_REFUTE_CHOSEN';
export const respondWithRefuteChosen = () => ({
  type: RESPOND_WITH_REFUTE_CHOSEN as typeof RESPOND_WITH_REFUTE_CHOSEN,
});
export type RespondWithRefuteChosen = ReturnType<typeof respondWithRefuteChosen>;

export const TAKE_MOVE_IN_APP_ACKNOWLEDGED = 'WALLET.TAKE_MOVE_IN_APP_ACKNOWLEDGED';
export const takeMoveInAppAcknowledged = (position: string, signature: string) => ({
  type: TAKE_MOVE_IN_APP_ACKNOWLEDGED as typeof TAKE_MOVE_IN_APP_ACKNOWLEDGED,
});
export type TakeMoveInAppAcknowledged = ReturnType<typeof takeMoveInAppAcknowledged>;

export const CHALLENGE_COMPLETION_ACKNOWLEDGED = 'WALLET.CHALLENGE_COMPLETION_ACKNOWLEDGED';
export const challengeCompletionAcknowledged = () => ({
  type: CHALLENGE_COMPLETION_ACKNOWLEDGED as typeof CHALLENGE_COMPLETION_ACKNOWLEDGED,
});
export type ChallengeCompletionAcknowledged = ReturnType<typeof challengeCompletionAcknowledged>;

// Common Transaction Actions
export const TRANSACTION_INITIATED = 'WALLET.TRANSACTION_INITIATED';
export const transactionInitiated = () => ({
  type: TRANSACTION_INITIATED as typeof TRANSACTION_INITIATED,
});
export type TransactionInitiated = ReturnType<typeof transactionInitiated>;

export const TRANSACTION_SUBMITTED = 'WALLET.TRANSACTION_SUBMITTED';
export const transactionSubmitted = () => ({
  type: TRANSACTION_SUBMITTED as typeof TRANSACTION_SUBMITTED,
});
export type TransactionSubmitted = ReturnType<typeof transactionSubmitted>;

export const TRANSACTION_CONFIRMED = 'WALLET.TRANSACTION_CONFIRMED';
export const transactionConfirmed = () => ({
  type: TRANSACTION_CONFIRMED as typeof TRANSACTION_CONFIRMED,
});
export type TransactionConfirmed = ReturnType<typeof transactionConfirmed>;

export const TRANSACTION_FINALIZED = 'WALLET.TRANSACTION_FINALIZED';
export const transactionFinalized = () => ({
  type: TRANSACTION_FINALIZED as typeof TRANSACTION_FINALIZED,
});
export type TransactionFinalized = ReturnType<typeof transactionFinalized>;



export const WITHDRAWAL_REQUESTED = 'WALLET.WITHDRAWAL_REQUESTED';
export const withdrawalRequested = () => ({
  type: WITHDRAWAL_REQUESTED as typeof WITHDRAWAL_REQUESTED,
});
export type WithdrawalRequested = ReturnType<typeof withdrawalRequested>;

export const WITHDRAWAL_APPROVED = 'WALLET.WITHDRAWAL_APPROVED';
export const withdrawalApproved = (destinationAddress: string) => ({
  type: WITHDRAWAL_APPROVED as typeof WITHDRAWAL_APPROVED,
  destinationAddress,
});
export type WithdrawalApproved = ReturnType<typeof withdrawalApproved>;

export const WITHDRAWAL_REJECTED = 'WALLET.WITHDRAWAL_REJECTED';
export const withdrawalRejected = () => ({
  type: WITHDRAWAL_REJECTED as typeof WITHDRAWAL_REJECTED,
});
export type WithdrawalRejected = ReturnType<typeof withdrawalRejected>;

export const WITHDRAWAL_SUCCESS_ACKNOWLEDGED = 'WALLET.WITHDRAWAL_SUCCESS_ACKNOWLEDGED';
export const withdrawalSuccessAcknowledged = () => ({
  type: WITHDRAWAL_SUCCESS_ACKNOWLEDGED as typeof WITHDRAWAL_SUCCESS_ACKNOWLEDGED,
});
export type WithdrawalSuccessAcknowledged = ReturnType<typeof withdrawalSuccessAcknowledged>;


// TODO: This is getting large, we should probably split this up into seperate types for each stage
export type WalletAction = (
  | LoggedIn
  | KeysLoaded
  | OwnPositionReceived
  | OpponentPositionReceived
  | FundingApproved
  | DeployInitiated
  | DeploySubmitted
  | DeployFinalised
  | DepositInitiated
  | DepositFinalised
  | PostFundSetupReceived
  | FundingSuccessAcknowledged
  | ChallengeRequested
  | OpponentChallengeDetected
  | ChallengeResponseReceived
  | ChallengedTimedOut
  | TakeMoveInAppAcknowledged
  | ChallengeApproved
  | ChallengeRejected
  | ChallengeResponseAcknowledged
  | ChallengeTimeoutAcknowledged
  | ChallengeCompletionAcknowledged
  | ChallengeAcknowledged
  | RespondWithMoveChosen
  | RespondWithExistingMoveChosen
  | RespondWithRefuteChosen
  | WithdrawalRequested
  | WithdrawalApproved
  | WithdrawalRejected
  | TransactionSubmitted
  | TransactionConfirmed
  | TransactionInitiated
  | WithdrawalSuccessAcknowledged
);
