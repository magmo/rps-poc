import * as states from '../../states';
import * as actions from '../actions';

import { WalletState, ClosingState } from '../../states';
import { WalletAction } from '../actions';
import { unreachable, ourTurn, validTransition } from '../../utils/reducer-utils';
import { State, Channel } from 'fmg-core';
import decode from '../../domain/decode';
import { signPositionHex, validSignature } from '../../utils/signing-utils';
import { sendMessage, closeSuccess, concludeSuccess } from '../../interface/outgoing';
import { handleSignatureAndValidationMessages } from '../../utils/state-utils';

export const closingReducer = (state: ClosingState, action: WalletAction): WalletState => {
  // Handle any signature/validation request centrally to avoid duplicating code for each state
  if (action.type === actions.OWN_POSITION_RECEIVED || action.type === actions.OPPONENT_POSITION_RECEIVED) {
    return { ...state, messageOutbox: handleSignatureAndValidationMessages(state, action) };
  }
  switch (state.type) {
    case states.APPROVE_CONCLUDE:
      return approveConcludeReducer(state, action);
    case states.WAIT_FOR_OPPONENT_CONCLUDE:
      return waitForOpponentConclude(state, action);
    case states.ACKNOWLEDGE_CONCLUDE_SUCCESS:
      return acknowledgeConcludeSuccessReducer(state, action);
    case states.ACKNOWLEDGE_CLOSE_SUCCESS:
      return acknowledgeCloseSuccessReducer(state, action);
    case states.ACKNOWLEDGE_CLOSED_ON_CHAIN:
      return acknowledgeClosedOnChainReducer(state, action);
    default:
      return unreachable(state);
  }
};

const approveConcludeReducer = (state: states.ApproveConclude, action: WalletAction) => {
  switch (action.type) {
    case actions.CONCLUDE_APPROVED:
      if (!ourTurn(state)) { return state; }

      const { positionData, positionSignature, sendMessageAction } = composeConcludePosition(state);
      const lastState = decode(state.lastPosition.data);
      if (lastState.stateType === State.StateType.Conclude) {
        return states.acknowledgeConcludeSuccess({
          ...state,
          turnNum: decode(positionData).turnNum,
          penultimatePosition: state.lastPosition,
          lastPosition: { data: positionData, signature: positionSignature },
          messageOutbox: sendMessageAction,
        });
      } else {
        return states.waitForOpponentConclude({
          ...state,
          turnNum: decode(positionData).turnNum,
          penultimatePosition: state.lastPosition,
          lastPosition: { data: positionData, signature: positionSignature },
          messageOutbox: sendMessageAction,
        });
      }
      break;
    default:
      return state;
  }
};

const waitForOpponentConclude = (state: states.WaitForOpponentConclude, action: WalletAction) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      if (!action.signature) { return state; }
      const concludePosition = decode(action.data);
      const opponentAddress = state.participants[1 - state.ourIndex];

      if (!validSignature(action.data, action.signature, opponentAddress)) { return state; }
      // check transition
      if (!validTransition(state, concludePosition)) { return state; }
      return states.acknowledgeConcludeSuccess({
        ...state,
        turnNum: concludePosition.turnNum,
        penultimatePosition: state.lastPosition,
        lastPosition: { data: action.data, signature: action.signature },
      });
    default:
      return state;
  }
};

const acknowledgeConcludeSuccessReducer = (state: states.AcknowledgeConcludeSuccess, action: WalletAction) => {
  switch (action.type) {
    case actions.CONCLUDE_SUCCESS_ACKNOWLEDGED:
      if (state.adjudicator) {
        return states.approveWithdrawal({
          ...state,
          adjudicator: state.adjudicator,
          messageOutbox: concludeSuccess(),
        });
      } else {
        return states.acknowledgeCloseSuccess({
          ...state,
          messageOutbox: concludeSuccess(),
        });
      }
    default:
      return state;
  }
};

const acknowledgeCloseSuccessReducer = (state: states.AcknowledgeCloseSuccess, action: WalletAction) => {
  switch (action.type) {
    case actions.CLOSE_SUCCESS_ACKNOWLEDGED:
      return states.waitForChannel({
        ...state,
        messageOutbox: closeSuccess(),
      });
    default:
      return state;
  }
};

const acknowledgeClosedOnChainReducer = (state: states.AcknowledgeClosedOnChain, action: WalletAction) => {
  switch (action.type) {
    case actions.CLOSED_ON_CHAIN_ACKNOWLEDGED:
      return states.waitForChannel({
        ...state,
        messageOutbox: closeSuccess(),
      });
    default:
      return state;
  }
};

const composeConcludePosition = (state: states.ClosingState) => {
  const lastState = decode(state.lastPosition.data);
  const stateCount = (lastState.stateType === State.StateType.Conclude) ? 1 : 0;
  const { libraryAddress, channelNonce, participants, turnNum } = state;
  const channel = new Channel(libraryAddress, channelNonce, participants);

  const concludeState = new State({
    channel,
    stateType: State.StateType.Conclude,
    turnNum: turnNum + 1,
    stateCount,
    resolution: lastState.resolution,
  });

  const positionData = concludeState.toHex();
  const positionSignature = signPositionHex(positionData, state.privateKey);
  const sendMessageAction = sendMessage(state.participants[1 - state.ourIndex], positionData, positionSignature);
  return { positionData, positionSignature, sendMessageAction };
};