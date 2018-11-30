import React from 'react';
import { PureComponent } from 'react';

import { unreachable } from '../utils';

import * as states from '../states';

import Todo from '../components/Todo';

interface Props {
  state: states.FundingState;
}

export default class FundingContainer extends PureComponent<Props> {
  render() {
    const state = this.props.state;

    switch (state.type) {
      case states.WAIT_FOR_FUNDING_REQUEST:
      case states.APPROVE_FUNDING:
      case states.A_INITIATE_DEPLOY:
      case states.B_WAIT_FOR_DEPLOY_INITIATION:
      case states.WAIT_FOR_DEPLOY_CONFIRMATION:
      case states.B_INITIATE_DEPOSIT:
      case states.A_WAIT_FOR_DEPOSIT_INITIATION:
      case states.WAIT_FOR_DEPOSIT_CONFIRMATION:
      case states.B_WAIT_FOR_POST_FUND_SETUP:
      case states.A_WAIT_FOR_POST_FUND_SETUP:
      case states.ACKNOWLEDGE_FUNDING_SUCCESS:
        return <Todo stateType={state.type} />;
      default:
        return unreachable(state);
    }
  }
}
