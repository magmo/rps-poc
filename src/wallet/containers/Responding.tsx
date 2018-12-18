import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as states from '../states';
import * as actions from '../redux/actions';

import Todo from '../components/Todo';
import AcknowledgeX from '../components/AcknowledgeX';
import WaitForXConfirmation from '../components/WaitForXConfirmation';
import SubmitX from '../components/SubmitX';
import { unreachable } from '../utils/reducer-utils';
import ChooseResponse from '../components/responding/ChooseResponse';

interface Props {
  state: states.RespondingState;
  challengeAcknowledged: () => void;
  challengeResponseAcknowledged: () => void;
  selectRespondWithMove: () => void;
}

class RespondingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      challengeAcknowledged,
      challengeResponseAcknowledged,
      selectRespondWithMove,
    } = this.props;

    switch (state.type) {
      case states.ACKNOWLEDGE_CHALLENGE:
        return (
          <AcknowledgeX
            title="Challenge detected!"
            description="Your opponent has challenged you on-chain."
            action={challengeAcknowledged}
            actionTitle="Proceed"
          />
        );
      case states.CHOOSE_RESPONSE:
        return <ChooseResponse expiryTime={state.challengeExpiry} selectRespondWithMove={selectRespondWithMove} />;
      case states.TAKE_MOVE_IN_APP:
        return <Todo stateType={state.type} />;
      case states.WAIT_FOR_RESPONSE_CONFIRMATION:
        return <WaitForXConfirmation name='response' />;
      case states.INITIATE_RESPONSE:
      case states.WAIT_FOR_RESPONSE_SUBMISSION:
        return <SubmitX name='response' />;
      case states.ACKNOWLEDGE_CHALLENGE_COMPLETE:
        return (
          <AcknowledgeX
            title="Challenge over!"
            description="Your response was successfully registered on-chain."
            action={challengeResponseAcknowledged}
            actionTitle="Return to app"
          />
        );
      default:
        return unreachable(state);
    }
  }
}

const mapDispatchToProps = {
  challengeAcknowledged: actions.challengeAcknowledged,
  challengeResponseAcknowledged: actions.challengeResponseAcknowledged,
  selectRespondWithMove: actions.respondWithMoveChosen,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(RespondingContainer);
