import React from 'react';
import { PureComponent } from 'react';

import { unreachable } from '../utils';

import * as states from '../states';

import Todo from '../components/Todo';

interface Props {
  state: states.WithdrawingState;
}

export default class InitializingContainer extends PureComponent<Props> {
  render() {
    const state = this.props.state;

    switch (state.type) {
      case states.APPROVE_WITHDRAWAL:
      case states.INITIATE_WITHDRAWAL:
      case states.WAIT_FOR_WITHDRAWAL_CONFIRMATION:
      case states.ACKNOWLEDGE_WITHDRAWAL_SUCCESS:
        return <Todo stateType={state.type} />;
      default:
        return unreachable(state);
    }
  }
}
