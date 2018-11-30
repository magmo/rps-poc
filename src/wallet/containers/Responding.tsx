import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { unreachable } from '../utils';

import * as states from '../states';
import * as actions from '../redux/actions';

import Todo from '../components/Todo';
import AcknowledgeChallenge from '../components/responding/AcknowledgeChallenge';

interface Props {
  state: states.RespondingState;
  challengeAcknowledged: () => void;
}

class RespondingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      challengeAcknowledged,
    } = this.props;

    switch (state.type) {
      case states.ACKNOWLEDGE_CHALLENGE:
        return <AcknowledgeChallenge challengeAcknowledged={challengeAcknowledged} />;
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

const mapDispatchToProps = {
  challengeAcknowledged: actions.challengeAcknowledged,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(RespondingContainer);
