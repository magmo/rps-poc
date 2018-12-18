import { Signature } from '../../domain';
import { WalletState } from '../../states';
import * as states from '../../states/challenging';
import * as runningStates from '../../states/running';
import * as actions from '../actions';
import { WalletAction } from '../actions';
import { unreachable, ourTurn, validTransition } from '../../utils/reducer-utils';
import { createForceMoveTransaction } from '../../utils/transaction-generator';
import { challengePositionReceived, signatureSuccess } from '../../interface/outgoing';
import decode from '../../domain/decode';
import { signPositionHex } from '../../utils/signing-utils';

export const challengingReducer = (state: states.ChallengingState, action: WalletAction): WalletState => {
  switch (state.type) {
    case states.APPROVE_CHALLENGE:
      return approveChallengeReducer(state, action);
    case states.WAIT_FOR_CHALLENGE_INITIATION:
      return initiateChallengeReducer(state, action);
    case states.WAIT_FOR_CHALLENGE_SUBMISSION:
      return waitForChallengeSubmissionReducer(state, action);
    case states.WAIT_FOR_CHALLENGE_CONFIRMATION:
      return waitForChallengeConfirmationReducer(state, action);
    case states.WAIT_FOR_RESPONSE_OR_TIMEOUT:
      return waitForResponseOrTimeoutReducer(state, action);
    case states.ACKNOWLEDGE_CHALLENGE_RESPONSE:
      return acknowledgeChallengeResponseReducer(state, action);
    case states.ACKNOWLEDGE_CHALLENGE_TIMEOUT:
      return acknowledgeChallengeTimeoutReducer(state, action);
    default:
      return unreachable(state);
  }
};

const approveChallengeReducer = (state: states.ApproveChallenge, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_APPROVED:
      const { data: fromPosition, signature: fromSignature } = state.penultimatePosition;
      const { data: toPosition, signature: toSignature } = state.lastPosition;
      const transaction = createForceMoveTransaction(state.adjudicator, fromPosition, toPosition, new Signature(fromSignature), new Signature(toSignature));
      return states.waitForChallengeInitiation(transaction, state);
    case actions.CHALLENGE_REJECTED:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

const initiateChallengeReducer = (state: states.WaitForChallengeInitiation, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_SENT_TO_METAMASK:
      return states.waitForChallengeSubmission({ ...state });
    default:
      return state;
  }
};

const waitForChallengeSubmissionReducer = (state: states.WaitForChallengeSubmission, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_SUBMITTED:
      return states.waitForChallengeConfirmation(state);
    default:
      return state;
  }
};

const waitForChallengeConfirmationReducer = (state: states.WaitForChallengeConfirmation, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      // This is a best guess on when the challenge will expire and will be updated by the challenge created event
      // TODO: Mover challenge duration to a shared constant
      const challengeExpiry = new Date(Date.now() + 2 * 60000).getTime();
      return states.waitForResponseOrTimeout({ ...state, challengeExpiry });
    default:
      return state;
  }
};

const waitForResponseOrTimeoutReducer = (state: states.WaitForResponseOrTimeout, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_CREATED_EVENT:
      return states.waitForResponseOrTimeout({ ...state, challengeExpiry: action.expirationTime * 1000 });
    case actions.RESPOND_WITH_MOVE_EVENT:
      const message = challengePositionReceived(action.responseState);
      // TODO: Right now we're just storing a dummy signature since we don't get one 
      // from the challenge. 
      return states.acknowledgeChallengeResponse({
        ...state,
        turnNum: state.turnNum + 1,
        lastPosition: { data: action.responseState, signature: '0x0' },
        penultimatePosition: state.lastPosition,
        messageOutbox: message,
      });
    case actions.CHALLENGE_TIMED_OUT:
      return states.acknowledgeChallengeTimeout({ ...state });
    default:
      return state;
  }
};

const acknowledgeChallengeResponseReducer = (state: states.AcknowledgeChallengeResponse, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.OWN_POSITION_RECEIVED:
      const data = action.data;
      const position = decode(data);
      // check it's our turn
      if (!ourTurn(state)) {
        return state;
      }

      // check transition
      if (!validTransition(state, position)) {
        return state;
      }

      const signature = signPositionHex(data, state.privateKey);
      return states.acknowledgeChallengeResponse({
        ...state,
        turnNum: state.turnNum + 1,
        lastPosition: { data, signature },
        penultimatePosition: state.lastPosition,
        messageOutbox: signatureSuccess(signature),
      });
    case actions.CHALLENGE_RESPONSE_ACKNOWLEDGED:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

const acknowledgeChallengeTimeoutReducer = (state: states.AcknowledgeChallengeTimeout, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_TIME_OUT_ACKNOWLEDGED:
      return runningStates.waitForUpdate({ ...state });
    default:
      return state;
  }
};

