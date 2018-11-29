import { ChallengeProof } from "src/wallet/domain/ChallengeProof";

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

export const APPROVE_CHALLENGE = 'WALLET.APPROVE_CHALLENGE';
export const approveChallenge = () => ({
  type: APPROVE_CHALLENGE as typeof APPROVE_CHALLENGE,
});
export type ApproveChallenge = ReturnType<typeof approveChallenge>;

export const DECLINE_CHALLENGE = 'WALLET.DECLINE_CHALLENGE';
export const declineChallenge = () => ({
  type: DECLINE_CHALLENGE as typeof DECLINE_CHALLENGE,
});
export type DeclineChallenge = ReturnType<typeof declineChallenge>;

export const CHALLENGE_REQUESTED = 'WALLET.CHALLENGE_REQUESTED';
export const challengeRequested = () => ({
  type: CHALLENGE_REQUESTED as typeof CHALLENGE_REQUESTED,
});
export type ChallengeRequested = ReturnType<typeof challengeRequested>;

export const CHALLENGE_INITIATED = 'WALLET.CHALLENGE_INITIATED';
export const challengeInitiated = (challengeProof: ChallengeProof) => ({
  type: CHALLENGE_INITIATED as typeof CHALLENGE_INITIATED,
  challengeProof,

});
export type ChallengeInitiated = ReturnType<typeof challengeInitiated>;

export const CHALLENGE_SUBMITTED = 'WALLET.CHALLENGE_SUBMITTED';
export const challengeSubmitted = () => ({
  type: CHALLENGE_SUBMITTED as typeof CHALLENGE_SUBMITTED,
});
export type ChallengeSubmitted = ReturnType<typeof challengeSubmitted>;


export const CHALLENGE_CONFIRMED = 'WALLET.CHALLENGE_CONFIRMED';
export const challengeConfirmed = () => ({
  type: CHALLENGE_CONFIRMED as typeof CHALLENGE_CONFIRMED,
});
export type ChallengeConfirmed = ReturnType<typeof challengeConfirmed>;

// TODO: Decide if we want to implement this
// export const CHALLENGE_FINALIZED = 'WALLET.CHALLENGE_FINALIZED';

export const OPPONENT_CHALLENGE_DETECTED = 'WALLET.OPPONENT_CHALLENGE_DETECTED';
export const opponentChallengeDetected = (challengeExpiry: Date) => ({
  type: OPPONENT_CHALLENGE_DETECTED as typeof OPPONENT_CHALLENGE_DETECTED,
  challengeExpiry,
});
export type OpponentChallengeDetected = ReturnType<typeof opponentChallengeDetected>;

// TODO: Decide if we want to implement this
// export const OPPONENT_CHALLENGE_FINALISED = '.';

export const CHALLENGE_RESPONSE_RECEIVED = 'WALLET.CHALLENGE_RESPONSE_RECEIVED';
export const challengeResponseReceived = (data: string) => ({
  type: CHALLENGE_RESPONSE_RECEIVED as typeof CHALLENGE_RESPONSE_RECEIVED,
  data,
});
export type ChallengeResponseReceived = ReturnType<typeof challengeResponseReceived>;

export const CHALLENGE_TIMEOUT = 'WALLET.CHALLENGE_TIMEOUT';
export const challengeTimeout = () => ({
  type: CHALLENGE_TIMEOUT as typeof CHALLENGE_TIMEOUT,
});
export type ChallengeTimeout = ReturnType<typeof challengeTimeout>;

export const ACKNOWLEDGE_CHALLENGE_TIMEOUT = 'WALLET.ACKNOWLEDGE_CHALLENGE_TIMEOUT';
export const acknowledgeChallengeTimeout = () => ({
  type: ACKNOWLEDGE_CHALLENGE_TIMEOUT as typeof ACKNOWLEDGE_CHALLENGE_TIMEOUT,
});
export type AcknowledgeChallengeTimeout = ReturnType<typeof acknowledgeChallengeTimeout>;

export const ACKNOWLEDGE_CHALLENGE_RESPONSE = 'WALLET.ACKNOWLEDGE_CHALLENGE_RESPONSE';
export const acknowledgeChallengeResponse = () => ({
  type: ACKNOWLEDGE_CHALLENGE_RESPONSE as typeof ACKNOWLEDGE_CHALLENGE_RESPONSE,
});
export type AcknowledgeChallengeResponse = ReturnType<typeof acknowledgeChallengeResponse>;

export const ACKNOWLEDGE_CHALLENGE = 'WALLET.ACKNOWLEDGE_CHALLENGE';
export const acknowledgeChallenge = () => ({
  type: ACKNOWLEDGE_CHALLENGE as typeof ACKNOWLEDGE_CHALLENGE,
});
export type AcknowledgeChallenge = ReturnType<typeof acknowledgeChallenge>;

export const SELECT_RESPOND_WITH_MOVE = 'WALLET.SELECT_RESPOND_WITH_MOVE';
export const selectRespondWithMove = () => ({
  type: SELECT_RESPOND_WITH_MOVE as typeof SELECT_RESPOND_WITH_MOVE,
});
export type SelectRespondWithMove = ReturnType<typeof selectRespondWithMove>;

export const SELECT_RESPOND_WITH_REFUTE = 'WALLET.SELECT_RESPOND_WITH_REFUTE';
export const selectRespondWithRefute = () => ({
  type: SELECT_RESPOND_WITH_REFUTE as typeof SELECT_RESPOND_WITH_REFUTE,
});
export type SelectRespondWithRefute = ReturnType<typeof selectRespondWithRefute>;

export const CHALLENGE_RESPONSE_INITIATED = 'WALLET.CHALLENGE_RESPONSE_INITIATED';
export const challengeResponseInitiated = () => ({
  type: CHALLENGE_RESPONSE_INITIATED as typeof CHALLENGE_RESPONSE_INITIATED,
});
export type ChallengeResponseInitiated = ReturnType<typeof challengeResponseInitiated>;


export const CHALLENGE_RESPONSE_SUBMITTED = 'WALLET.CHALLENGE_RESPONSE_SUBMITTED';
export const challengeResponseSubmitted = () => ({
  type: CHALLENGE_RESPONSE_SUBMITTED as typeof CHALLENGE_RESPONSE_SUBMITTED,
});
export type ChallengeResponseSubmitted = ReturnType<typeof challengeResponseSubmitted>;

export const CHALLENGE_RESPONSE_CONFIRMED = 'WALLET.CHALLENGE_RESPONSE_CONFIRMED';
export const challengeResponseConfirmed = () => ({
  type: CHALLENGE_RESPONSE_CONFIRMED as typeof CHALLENGE_RESPONSE_CONFIRMED,
});
export type ChallengeResponseConfirmed = ReturnType<typeof challengeResponseConfirmed>;

export const TAKE_MOVE_IN_APP = 'WALLET.TAKE_MOVE_IN_APP';
export const takeMoveInApp = (position: string, signature: string) => ({
  type: TAKE_MOVE_IN_APP as typeof TAKE_MOVE_IN_APP,
  position,
  signature,
});
export type TakeMoveInApp = ReturnType<typeof takeMoveInApp>;

export const ACKNOWLEDGE_CHALLENGE_COMPLETE = 'WALLET.ACKNOWLEDGE_CHALLENGE_COMPLETE';
export const acknowledgeChallengeComplete = () => ({
  type: ACKNOWLEDGE_CHALLENGE_COMPLETE as typeof ACKNOWLEDGE_CHALLENGE_COMPLETE,
});
export type AcknowledgeChallengeComplete = ReturnType<typeof acknowledgeChallengeComplete>;


export const WITHDRAWAL_REQUESTED = '.';
export const WITHDRAWAL_INTITIATED = '.'; // when sent to metamask
export const WITHDRAWAL_SUBMITTED = '.';
export const WITHDRAWAL_CONFIRMED = '.';
export const WITHDRAWAL_FINALISED = '.';

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
  | ChallengeInitiated
  | ChallengeSubmitted
  | ChallengeConfirmed
  | ChallengeResponseReceived
  | ChallengeResponseInitiated
  | ChallengeResponseSubmitted
  | ChallengeResponseConfirmed
  | ChallengeTimeout
  | TakeMoveInApp
  | ApproveChallenge
  | DeclineChallenge
  | AcknowledgeChallengeResponse
  | AcknowledgeChallengeTimeout
  | AcknowledgeChallengeComplete
  | AcknowledgeChallenge
  | SelectRespondWithMove
  | SelectRespondWithRefute
);
