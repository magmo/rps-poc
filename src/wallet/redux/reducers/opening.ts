import { State } from 'fmg-core';
import { validSignature } from './helpers';

import * as states from '../../states';
import * as actions from '../actions';
import { unreachable } from '../../utils';

import decode from '../../domain/decode';

export const openingReducer = (state: states.OpeningState, action: actions.WalletAction): states.WalletState => {
  switch (state.type) {
    case states.WAIT_FOR_CHANNEL:
      return waitForChannelReducer(state, action);
    case states.WAIT_FOR_PRE_FUND_SETUP:
      return waitForPreFundSetupReducer(state, action);
    default:
      return unreachable(state);
  }
};

const waitForChannelReducer = (state: states.WaitForChannel, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.OWN_POSITION_RECEIVED:
      const ownPosition = decode(action.data);

      // all these checks will fail silently for the time being
      // check it's a PreFundSetupA
      if (ownPosition.stateType !== State.StateType.PreFundSetup) { return state; }
      if (ownPosition.stateCount !== 0) { return state; }

      const ourAddress = ownPosition.channel.participants[0] as string;
      const opponentAddress = ownPosition.channel.participants[1] as string;

      if (ourAddress !== state.address) { return state; }

      // if so, unpack its contents into the state
      return states.waitForPreFundSetup({
        ...state,
        libraryAddress: ownPosition.channel.gameLibrary,
        channelId: ownPosition.channel.channelId,
        ourIndex: 0,
        participants: [ourAddress, opponentAddress],
        channelNonce: ownPosition.channel.channelNonce,
        turnNum: 0,
        lastPosition: action.data,
      });

    case actions.OPPONENT_POSITION_RECEIVED:
      const opponentPosition = decode(action.data);

      // all these checks will fail silently for the time being
      // check it's a PreFundSetupA
      if (opponentPosition.stateType !== State.StateType.PreFundSetup) { return state; }
      if (opponentPosition.stateCount !== 0) { return state; }


      const ourAddress2 = opponentPosition.channel.participants[1] as string;
      const opponentAddress2 = opponentPosition.channel.participants[0] as string;

      if (!validSignature(action.data, action.signature, opponentAddress2)) { return state; }

      if (ourAddress2 !== state.address) { return state; }

      // if so, unpack its contents into the state
      return states.waitForPreFundSetup({
        ...state,
        libraryAddress: opponentPosition.channel.gameLibrary,
        channelId: opponentPosition.channel.channelId,
        ourIndex: 0,
        participants: [ourAddress2, opponentAddress2],
        channelNonce: opponentPosition.channel.channelNonce,
        turnNum: 0,
        lastPosition: action.data,
      });

    default:
      return state;
  }
};

const waitForPreFundSetupReducer = (state: states.WaitForPreFundSetup, action: actions.WalletAction) => {
  switch (action.type) {
    case actions.OWN_POSITION_RECEIVED:
      const ownPosition = decode(action.data);

      // all these checks will fail silently for the time being
      // check it's a PreFundSetupB
      if (ownPosition.stateType !== State.StateType.PreFundSetup) { return state; }
      if (ownPosition.stateCount !== 1) { return state; }

      // if so, unpack its contents into the state
      return states.waitForFundingRequest({
        ...state,
        turnNum: 1,
        lastPosition: action.data,
        penultimatePosition: state.lastPosition,
      });

    case actions.OPPONENT_POSITION_RECEIVED:
      const opponentPosition = decode(action.data);

      // all these checks will fail silently for the time being
      // check it's a PreFundSetupB
      if (opponentPosition.stateType !== State.StateType.PreFundSetup) { return state; }
      if (opponentPosition.stateCount !== 1) { return state; }

      const opponentAddress2 = state.participants[1 - state.ourIndex];

      if (!validSignature(action.data, action.signature, opponentAddress2)) { return state; }

      // if so, unpack its contents into the state
      return states.waitForFundingRequest({
        ...state,
        turnNum: 1,
        lastPosition: action.data,
        penultimatePosition: state.lastPosition,
      });

    default:
      return state;
  }
};