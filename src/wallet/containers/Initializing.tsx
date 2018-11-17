import React from 'react';

import { unreachable } from '../utils';

import { PureComponent } from 'react';

import { InitializingState, WAIT_FOR_ADDRESS, WAIT_FOR_CHANNEL, WAIT_FOR_LOGIN } from '../states';

import Todo from '../components/Todo';

interface Props {
  state: InitializingState;
}

export default class InitializingContainer extends PureComponent<Props> {
  render() {
    const state = this.props.state;

    switch (state.type) {
      case WAIT_FOR_LOGIN:
        return <Todo stateType={state.type} />;
      case WAIT_FOR_ADDRESS:
        return <Todo stateType={state.type} />;
      case WAIT_FOR_CHANNEL:
        return <Todo stateType={state.type} />;
      default:
        return unreachable(state);
    }
  }
}
