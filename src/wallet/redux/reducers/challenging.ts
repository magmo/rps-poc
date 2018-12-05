import { Signature } from '../../domain';
import { createForceMoveTransaction } from '../../domain/TransactionGenerator';
import { WalletState } from '../../states';
import * as states from '../../states/challenging';
import * as runningStates from '../../states/running';
import { unreachable } from '../../utils';
import * as actions from '../actions';
import { WalletAction } from '../actions';

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
      const transaction = createForceMoveTransaction(state.adjudicator, fromPosition, toPosition, new Signature(toSignature), new Signature(fromSignature));
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
      return states.waitForResponseOrTimeout({ ...state });
    default:
      return state;
  }
};

const waitForResponseOrTimeoutReducer = (state: states.WaitForResponseOrTimeout, action: WalletAction): WalletState => {
  switch (action.type) {
    case actions.CHALLENGE_RESPONSE_RECEIVED:
      return states.acknowledgeChallengeResponse({ ...state });
    case actions.CHALLENGE_TIMED_OUT:
      return states.acknowledgeChallengeTimeout({ ...state });
    default:
      return state;
  }
};

const acknowledgeChallengeResponseReducer = (state: states.AcknowledgeChallengeResponse, action: WalletAction): WalletState => {
  switch (action.type) {
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

