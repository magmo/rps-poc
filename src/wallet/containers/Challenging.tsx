import React from 'react';
import { PureComponent } from 'react';

import { unreachable } from '../utils';
import * as states from '../states';

import Todo from '../components/Todo';
import WaitForResponseOrTimeout from '../components/challenging/WaitForResponseOrTimeout';
import WaitForChallengeConfirmation from '../components/challenging/WaitForChallengeConfirmation';
import AcknowledgeChallengeTimeout from '../components/challenging/AcknowledgeChallengeTimeout';
import { connect } from 'react-redux';
import { withdrawalRequested } from '../redux/actions';

interface Props {
  state: states.ChallengingState;
  withdraw: () => void;
}

class ChallengingContainer extends PureComponent<Props> {
  render() {
    const { state, withdraw } = this.props;

    switch (state.type) {
      case states.APPROVE_CHALLENGE:
        return <Todo stateType={state.type} />;
      case states.WAIT_FOR_CHALLENGE_INITIATION:
        return <Todo stateType={state.type} />;
      case states.WAIT_FOR_CHALLENGE_SUBMISSION:
        return <Todo stateType={state.type} />;
      case states.WAIT_FOR_CHALLENGE_CONFIRMATION:
        return <WaitForChallengeConfirmation />;
      case states.WAIT_FOR_RESPONSE_OR_TIMEOUT:
        return <WaitForResponseOrTimeout expirationTime={100 /*todo*/} />;
      case states.ACKNOWLEDGE_CHALLENGE_RESPONSE:
        return <Todo stateType={state.type} />;
      case states.ACKNOWLEDGE_CHALLENGE_TIMEOUT:
        return <AcknowledgeChallengeTimeout expirationTime={100 /*todo*/} withdraw={withdraw} />;
      default:
        return unreachable(state);
    }
  }
}
const mapDispatchToProps = {
  withdraw: withdrawalRequested, 
};

// why does it think that mapStateToProps can return undefined??

export default connect(
  () => ({}),
  mapDispatchToProps,
)(ChallengingContainer);

