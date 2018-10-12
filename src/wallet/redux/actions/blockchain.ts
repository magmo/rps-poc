import BN from 'bn.js';
import { ConclusionProof } from '../../domain/ConclusionProof';
import { State } from 'fmg-core';
import { ChallengeProof } from '../../domain/ChallengeProof';
import { Signature } from 'src/wallet/domain/Signature';

export type DeploymentRequest = ReturnType<typeof deploymentRequest>;
export type DeploymentSuccess = ReturnType<typeof deploymentSuccess>;
export type DeploymentFailure = ReturnType<typeof deploymentFailure>;
export type DeploymentResponse = DeploymentSuccess | DeploymentFailure;

export type DepositRequest = ReturnType<typeof depositRequest>;
export type DepositSuccess = ReturnType<typeof depositSuccess>;
export type DepositFailure = ReturnType<typeof depositFailure>;
export type DepositResponse = DepositSuccess | DepositFailure;

export type ConcludeGame = ReturnType<typeof concludeGame>;

export type WithdrawRequest = ReturnType<typeof withdrawRequest>;
export type WithdrawSuccess = ReturnType<typeof withdrawSuccess>;
export type WithdrawFailure = ReturnType<typeof withdrawFailure>;
export type WithdrawResponse = WithdrawSuccess | WithdrawFailure;

export type ForceMoveRequest = ReturnType<typeof forceMove>;
export type RespondWithMoveRequest = ReturnType<typeof respondWithMoveRequest>;

export type RequestAction = DeploymentRequest | DepositRequest | WithdrawRequest | ForceMoveRequest | RespondWithMoveRequest;

export const DEPLOY_REQUEST = 'BLOCKCHAIN.DEPLOY.REQUEST';
export const DEPLOY_SUCCESS = 'BLOCKCHAIN.DEPLOY.SUCCESS';
export const DEPLOY_FAILURE = 'BLOCKCHAIN.DEPLOY.FAILURE';

export const DEPOSIT_REQUEST = 'BLOCKCHAIN.DEPOSIT.REQUEST';
export const DEPOSIT_SUCCESS = 'BLOCKCHAIN.DEPOSIT.SUCCESS';
export const DEPOSIT_FAILURE = 'BLOCKCHAIN.DEPOSIT.FAILURE';

export const CONCLUDE_GAME = 'BLOCKCHAIN.GAME.CONCLUDE';

export const WITHDRAW_REQUEST = 'BLOCKCHAIN.WITHDRAW.REQUEST';
export const WITHDRAW_SUCCESS = 'BLOCKCHAIN.WITHDRAW.SUCCESS';
export const WITHDRAW_FAILURE = 'BLOCKCHAIN.WITHDRAW.FAILURE';

export const FORCEMOVE_REQUEST = 'BLOCKCHAIN.CHALLENGE.FORCE_MOVE.REQUEST';
export const FORCEMOVE_SUCCESS = 'BLOCKCHAIN.CHALLENGE.FORCE_MOVE.SUCCESS';
export const FORCEMOVE_FAILURE = 'BLOCKCHAIN.CHALLENGE.FORCE_MOVE.FAILURE';
export const RESPONDWITHMOVE_REQUEST = 'BLOCKCHAIN.CHALLENGE.RESPOND_WITH_MOVE.REQUEST';
export const RESPONDWITHMOVE_SUCCESS = 'BLOCKCHAIN.CHALLENGE.RESPOND_WITH_MOVE.SUCCESS';
export const RESPONDWITHMOVE_FAILURE = 'BLOCKCHAIN.CHALLENGE.RESPOND_WITH_MOVE.FAILURE';

export const FUNDSRECEIVED_EVENT = 'BLOCKCHAIN.EVENT.FUNDSRECEIVED';
export const GAMECONCLUDED_EVENT = 'BLOCKCHAIN.EVENT.GAMECONCLUDED';
export const FUNDSWITHDRAWN_EVENT = 'BLOCKCHAIN.EVENT.FUNDSWITHDRAWN';
export const CHALLENGECREATED_EVENT = 'BLOCKCHAIN.EVENT.CHALLENGECREATED';
export const CHALLENGECANCELLED_EVENT = 'BLOCKCHAIN.EVENT.CHALLENGECANCELLED';
export const CHALLENGECONCLUDED_EVENT = 'BLOCKCHAIN.EVENT.CHALLENGECONCLUDED';

export const UNSUBSCRIBE_EVENTS = 'BLOCKCHAIN.EVENT.UNSUBSCRIBE';

export const forceMove = (challengeProof: ChallengeProof) => ({
  type: FORCEMOVE_REQUEST as typeof FORCEMOVE_REQUEST,
  challengeProof,
});

export const forceMoveSuccess = () => ({
  type: FORCEMOVE_SUCCESS as typeof FORCEMOVE_SUCCESS,
});

export const forceMoveFailure = () => ({
  type: FORCEMOVE_FAILURE as typeof FORCEMOVE_FAILURE,
});

export const respondWithMoveRequest= (positionData:string, signature:Signature) => ({
  type: RESPONDWITHMOVE_REQUEST as typeof RESPONDWITHMOVE_REQUEST,
  positionData,
  signature,
});

export const respondWithMoveSuccess = ()=>({
  type: RESPONDWITHMOVE_SUCCESS as typeof RESPONDWITHMOVE_SUCCESS,
});

export const respondWithMoveFailure = (error)=>({
  type: RESPONDWITHMOVE_FAILURE as typeof RESPONDWITHMOVE_FAILURE,
  error,
});

export const deploymentRequest = (channelId: any, amount: BN) => ({
  type: DEPLOY_REQUEST,
  channelId,
  amount,
});
export const deploymentSuccess = (address: string) => ({
  type: DEPLOY_SUCCESS,
  address,
});

export const deploymentFailure = (error: any) => ({
  type: DEPLOY_FAILURE,
  error,
});

export const depositRequest = (address: string, amount: BN) => ({
  type: DEPOSIT_REQUEST,
  address,
  amount,
});
export const depositSuccess = (transaction: any) => ({
  type: DEPOSIT_SUCCESS,
  transaction,
});
export const depositFailure = (error: any) => ({
  type: DEPOSIT_FAILURE,
  error,
});

export const concludeGame = (channelId: string, state: State) => {
  if (state.stateType !== State.StateType.Conclude) {
    throw new Error("State must be Conclude");
  }
  return ({
    type: CONCLUDE_GAME,
    channelId,
    state,
  });
};

export const withdrawRequest = (
  proof: ConclusionProof,
  withdrawData: { playerAddress: string, destination: string, channelId: string, v: string, r: string, s: string },
) => ({
  type: WITHDRAW_REQUEST,
  proof,
  withdrawData,
});
export const withdrawSuccess = (transaction: any) => ({
  type: WITHDRAW_SUCCESS,
  transaction,
});
export const withdrawFailure = (error: any) => ({
  type: WITHDRAW_FAILURE,
  error,
});

export const unsubscribeForEvents = () => ({
  type: UNSUBSCRIBE_EVENTS,
});

// EVENTS
// TODO: Create an event type with the properties we're interested in

export type ChallengeCreated = ReturnType<typeof challengeCreatedEvent>;
export type ChallengeConcluded = ReturnType<typeof challengeConcludedEvent>;

export const fundsReceivedEvent = ({ amountReceived, adjudicatorBalance, sender }) => ({
  type: FUNDSRECEIVED_EVENT,
  amountReceived,
  adjudicatorBalance,
  sender,
});

export const gameConcluded = (channelId: string) => {
  return ({
    type: GAMECONCLUDED_EVENT,
    channelId,
  });
};

export const fundsWithdrawnEvent = (amountWithdrawn, adjudicatorBalance, sender) => ({
  type: FUNDSWITHDRAWN_EVENT,
  amountWithdrawn,
  adjudicatorBalance,
  sender,
});

export const challengeCreatedEvent = ({ state, expirationTime }) => ({
  type: CHALLENGECREATED_EVENT as typeof CHALLENGECREATED_EVENT,
  state,
  expirationTime,
});

export const challengeConcludedEvent = (responseState)=>({
  type: CHALLENGECONCLUDED_EVENT as typeof CHALLENGECONCLUDED_EVENT,
  responseState,
});