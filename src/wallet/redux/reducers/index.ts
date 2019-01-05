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
  ApproveConclude,
  acknowledgeClosedOnChain,
  AcknowledgeClosedOnChain,
} from '../../states';

import { initializingReducer } from './initializing';
import { openingReducer } from './opening';
import { fundingReducer } from './funding';
import { runningReducer } from './running';
import { challengingReducer } from './challenging';
import { respondingReducer } from './responding';
import { withdrawingReducer } from './withdrawing';
import { closingReducer } from './closing';
import { WalletAction, CONCLUDE_REQUESTED, MESSAGE_RECEIVED, GAME_CONCLUDED_EVENT } from '../actions';
import { unreachable, ourTurn, validTransition } from '../../utils/reducer-utils';
import decode from '../../domain/decode';
import { validSignature } from '../../utils/signing-utils';
import { State } from 'fmg-core';

const initialState = waitForLogin();

export const walletReducer = (state: WalletState = initialState, action: WalletAction): WalletState => {
  const conclusionStateFromOwnRequest = receivedValidOwnConclusionRequest(state, action);
  if (conclusionStateFromOwnRequest) { return conclusionStateFromOwnRequest; }

  const conclusionStateFromOpponentRequest = receivedValidOpponentConclusionRequest(state, action);
  if (conclusionStateFromOpponentRequest) { return conclusionStateFromOpponentRequest; }

  const closedOnChainState = receivedValidOpponentClosedOnChain(state, action);
  if (closedOnChainState) { return closedOnChainState; }

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

const receivedValidOwnConclusionRequest = (state: WalletState, action: WalletAction): ApproveConclude | null => {
  // TODO: Handle conclude if the game isn't funded.
  if (state.stage !== RUNNING) { return null; }
  if (action.type !== CONCLUDE_REQUESTED || !ourTurn(state)) { return null; }
  return approveConclude(state);
};

const receivedValidOpponentConclusionRequest = (state: WalletState, action: WalletAction): ApproveConclude | null => {
  // TODO: Handle conclude if the game isn't funded.
  if (state.stage !== RUNNING) { return null; }
  if (action.type !== MESSAGE_RECEIVED) { return null; }

  let position;
  try {
    position = decode(action.data);
  } catch (error) {
    return null;
  }

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
};

const receivedValidOpponentClosedOnChain = (state: WalletState, action: WalletAction): AcknowledgeClosedOnChain | null => {
  if (state.stage !== FUNDING && state.stage !== RUNNING && state.stage !== CLOSING) { return null; }
  if (action.type !== GAME_CONCLUDED_EVENT) { return null; }

  if ('adjudicator' in state && state.adjudicator) {
    return acknowledgeClosedOnChain({ ...state, adjudicator: state.adjudicator });
  }
  return null;
};
