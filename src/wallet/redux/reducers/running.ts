
import * as states from '../../states';
import * as actions from '../actions';
import decode from '../../domain/decode';

import { validSignature, validTransition, ourTurn } from './helpers';
import { State } from 'fmg-core';

export const runningReducer = (state: states.RunningState, action: actions.WalletAction): states.WalletState => {
  return waitForUpdateReducer(state, action);
};

const waitForUpdateReducer = (state: states.WaitForUpdate, action: actions.WalletAction): states.WalletState => {
  switch (action.type) {
    case actions.OWN_POSITION_RECEIVED:
      const position = decode(action.data);
      // check it's our turn
      if (!ourTurn(state)) { return state; }

      // check transition
      if (!validTransition(state, position)) { return state; }

      // if conclude => concluding
      if (position.stateType === State.StateType.Conclude) {
        return states.concluding({
          ...state,
          turnNum: state.turnNum + 1,
          lastPosition: action.data,
          penultimatePosition: state.lastPosition,
        });
      } else {
        // else => running
        return states.waitForUpdate({
          ...state,
          turnNum: state.turnNum + 1,
          lastPosition: action.data,
          penultimatePosition: state.lastPosition,
        });
      }

    case actions.OPPONENT_POSITION_RECEIVED:
      if (ourTurn(state)) { return state; }

      const position1 = decode(action.data);
      // check signature
      const opponentAddress = state.participants[1 - state.ourIndex];
      if (!validSignature(action.data, action.signature, opponentAddress)) { return state; }
      // check transition
      if (!validTransition(state, position1)) { return state; }

      // if conclude => concluding
      if (position1.stateType === State.StateType.Conclude) {
        return states.concluding({
          ...state,
          turnNum: state.turnNum + 1,
          lastPosition: action.data,
          penultimatePosition: state.lastPosition,
        });
      } else {
        // else => running
        return states.waitForUpdate({
          ...state,
          turnNum: state.turnNum + 1,
          lastPosition: action.data,
          penultimatePosition: state.lastPosition,
        });
      }

    case actions.OPPONENT_CHALLENGE_DETECTED:
      // transition to responding
      return states.acknowledgeChallenge(state);

    case actions.CHALLENGE_REQUESTED:
      // transition to challenging
      return states.approveChallenge(state);

    default:
      return state;
  }
};


