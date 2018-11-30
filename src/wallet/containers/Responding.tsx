import React from 'react';
import { PureComponent } from 'react';

import { unreachable } from '../utils';

import * as states from '../states';

import Todo from '../components/Todo';

interface Props {
  state: states.RespondingState;
}

export default class InitializingContainer extends PureComponent<Props> {
  render() {
    const state = this.props.state;

    switch (state.type) {
      case states.ACKNOWLEDGE_CHALLENGE:
      case states.CHOOSE_RESPONSE:
      case states.TAKE_MOVE_IN_APP:
      case states.INITIATE_RESPONSE:
      case states.WAIT_FOR_RESPONSE_CONFIRMATION:
      case states.WAIT_FOR_RESPONSE_SUBMISSION:
      case states.ACKNOWLEDGE_CHALLENGE_COMPLETE:
        return <Todo stateType={state.type} />;
      default:
        return unreachable(state);
    }
  }
}
