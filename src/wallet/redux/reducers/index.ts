import {
  WalletState,
  INITIALIZING,
  OPENING,
  FUNDING,
  RUNNING,
  CHALLENGING,
  RESPONDING,
  WITHDRAWING,
  CLOSING,
  waitForLogin,
  approveConclude,
  WAIT_FOR_LOGIN,
  WAIT_FOR_ADDRESS,
  WAIT_FOR_CHANNEL,
  WAIT_FOR_PRE_FUND_SETUP,
  ApproveConclude,
  WAIT_FOR_FUNDING_REQUEST,
  APPROVE_FUNDING,
  A_WAIT_FOR_DEPLOY_TO_BE_SENT_TO_METAMASK,
  A_SUBMIT_DEPLOY_IN_METAMASK,
  B_WAIT_FOR_DEPLOY_ADDRESS,
  WAIT_FOR_DEPLOY_CONFIRMATION,
  CLOSED,
} from '../../states';

import { initializingReducer } from './initializing';
import { openingReducer } from './opening';
import { fundingReducer } from './funding';
import { runningReducer } from './running';
import { challengingReducer } from './challenging';
import { respondingReducer } from './responding';
import { withdrawingReducer } from './withdrawing';
import { closingReducer } from './closing';
import { WalletAction, CONCLUDE_REQUESTED, MESSAGE_RECEIVED } from '../actions';
import { unreachable, ourTurn, validTransition } from '../../utils/reducer-utils';
import decode from '../../domain/decode';
import { validSignature } from '../../utils/signing-utils';
import { State } from 'fmg-core';

const initialState = waitForLogin();

export const walletReducer = (state: WalletState = initialState, action: WalletAction): WalletState => {
  const ourConclusionState = ourValidConclusionRequest(state, action);
  if (ourConclusionState) {
    return ourConclusionState;
  }

  const conclusionState = opponentConclussionReceived(state, action);
  if (conclusionState) {
    return conclusionState;
  }

  switch (state.stage) {
    case INITIALIZING:
      return initializingReducer(state, action);
    case OPENING:
      return openingReducer(state, action);
    case FUNDING:
      return fundingReducer(state, action);
    case RUNNING:
      return runningReducer(state, action);
    case CHALLENGING:
      return challengingReducer(state, action);
    case RESPONDING:
      return respondingReducer(state, action);
    case WITHDRAWING:
      return withdrawingReducer(state, action);
    case CLOSING:
      return closingReducer(state, action);
    default:
      return unreachable(state);
  }
};

const ourValidConclusionRequest = (state: WalletState, action: WalletAction): ApproveConclude | null => {
  switch (state.type) {
    case WAIT_FOR_LOGIN:
    case WAIT_FOR_ADDRESS:
    case WAIT_FOR_CHANNEL:
    case WAIT_FOR_PRE_FUND_SETUP:
    case WAIT_FOR_FUNDING_REQUEST:
    case APPROVE_FUNDING:
    case A_WAIT_FOR_DEPLOY_TO_BE_SENT_TO_METAMASK:
    case A_SUBMIT_DEPLOY_IN_METAMASK:
    case B_WAIT_FOR_DEPLOY_ADDRESS:
    case WAIT_FOR_DEPLOY_CONFIRMATION:
    case CLOSED:
      return null;
    default:
      if (action.type !== CONCLUDE_REQUESTED || !ourTurn(state)) { return null; }
      return approveConclude(state);
  }
};

const opponentConclussionReceived = (state: WalletState, action: WalletAction): ApproveConclude | null => {
  if (action.type !== MESSAGE_RECEIVED) {
    return null;
  }

  switch (state.type) {
    case WAIT_FOR_LOGIN:
    case WAIT_FOR_ADDRESS:
    case WAIT_FOR_CHANNEL:
    case WAIT_FOR_PRE_FUND_SETUP:
    case WAIT_FOR_FUNDING_REQUEST:
    case APPROVE_FUNDING:
    case A_WAIT_FOR_DEPLOY_TO_BE_SENT_TO_METAMASK:
    case A_SUBMIT_DEPLOY_IN_METAMASK:
    case B_WAIT_FOR_DEPLOY_ADDRESS:
    case WAIT_FOR_DEPLOY_CONFIRMATION:
    case CLOSED:
      return null;
    default:
      const position = decode(action.data);
      if (position.stateType !== State.StateType.Conclude) {
        return null;
      }
      // check signature
      const opponentAddress = state.participants[1 - state.ourIndex];
      if (!action.signature) { return null; }
      if (!validSignature(action.data, action.signature, opponentAddress)) { return null; }
      if (!validTransition(state, position)) { return null; }

      return approveConclude({
        ...state,
        turnNum: position.turnNum,
        lastPosition: { data: action.data, signature: action.signature },
        penultimatePosition: state.lastPosition,
      });
  }
};