import React from 'react';

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
} from '../states';

import InitializingContainer from './Initializing';
import Todo from '../components/Todo';

interface Props {
  state: WalletState;
}

const FullContainer = (props: Props) => {
  const state = props.state;

  switch (state.stage) {
    case INITIALIZING:
      return <InitializingContainer state={state} />;
    case OPENING:
    case FUNDING:
    case RUNNING:
    case CHALLENGING:
    case RESPONDING:
    case WITHDRAWING:
    case CLOSING:
      return <Todo stateType={state.type} />;
    default:
      return unreachable(state);
  }
};

function unreachable(x: never) { return x; }

export default FullContainer;
