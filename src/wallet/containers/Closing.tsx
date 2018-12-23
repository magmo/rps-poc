import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as states from '../states';
import * as actions from '../redux/actions';

import AcknowledgeX from '../components/AcknowledgeX';
import ApproveX from '../components/ApproveX';
import { unreachable } from '../utils/reducer-utils';
import WaitForOtherPlayer from '../components/WaitForOtherPlayer';

interface Props {
  state: states.ClosingState;
  concludeApproved: () => void;
  concludeRejected: () => void;
  concludeSuccessAcknowledged: () => void;
  closeSuccessAcknowledged: () => void;
}

class ClosingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      concludeApproved,
      concludeRejected,
      concludeSuccessAcknowledged,
      closeSuccessAcknowledged,
    } = this.props;

    switch (state.type) {
      case states.APPROVE_CONCLUDE:
        return (
          <ApproveX
            title="Conclude the channel!"
            description="Do you wish to conclude this channel?"
            approvalAction={concludeApproved}
            rejectionAction={concludeRejected}
          />
        );
      case states.WAIT_FOR_OPPONENT_CONCLUDE:
        return <WaitForOtherPlayer name="conclude" />;
      case states.ACKNOWLEDGE_CONCLUDE_SUCCESS:
        return (
          <AcknowledgeX
            title="Conclude successfull!"
            action={concludeSuccessAcknowledged}
            description="You have successfully concluded your channel"
            actionTitle="Proceed to withdraw"
          />
        );
      case states.ACKNOWLEDGE_CLOSE_SUCCESS:
        return (
          <AcknowledgeX
            title="Channel closed!"
            action={closeSuccessAcknowledged}
            description="You have successfully closed your channel"
            actionTitle="Ok!"
          />
        );
      case states.CLOSED_ON_CHAIN:
        return null;
      default:
        return unreachable(state);
    }
  }
}

const mapDispatchToProps = {
  concludeApproved: actions.concludeApproved,
  concludeRejected: actions.concludeRejected,
  concludeSuccessAcknowledged: actions.concludeSuccessAcknowledged,
  closeSuccessAcknowledged: actions.closeSuccessAcknowledged,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(ClosingContainer);
