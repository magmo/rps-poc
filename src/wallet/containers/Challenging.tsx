import React from 'react';
import { PureComponent } from 'react';

import { unreachable } from '../utils';
import * as states from '../states';

import AcknowledgeChallengeResponse from '../components/challenging/AcknowledgeChallengeResponse';
import WaitForResponseOrTimeout from '../components/challenging/WaitForResponseOrTimeout';
import WaitForChallengeConfirmation from '../components/challenging/WaitForChallengeConfirmation';
import AcknowledgeChallengeTimeout from '../components/challenging/AcknowledgeChallengeTimeout';
import ApproveChallenge from '../components/challenging/ApproveChallenge';

import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import WaitForChallengeInitiation from '../components/challenging/WaitForChallengeInitiation';
import WaitForChallengeSubmission from '../components/challenging/WaitForChallengeSubmission';

interface Props {
  state: states.ChallengingState;
  withdrawalRequested: () => void;
  challengeResponseAcknowledged: () => void;
  challengeApproved: () => void;
  challengeRejected: () => void;
}

class ChallengingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      withdrawalRequested,
      challengeResponseAcknowledged,
      challengeApproved,
      challengeRejected,
    } = this.props;

    switch (state.type) {
      case states.APPROVE_CHALLENGE:
        return (
          <ApproveChallenge
            challengeApproved={challengeApproved}
            challengeRejected={challengeRejected}
          />
        );
      case states.WAIT_FOR_CHALLENGE_INITIATION:
        return <WaitForChallengeInitiation />;
      case states.WAIT_FOR_CHALLENGE_SUBMISSION:
        return <WaitForChallengeSubmission />;
      case states.WAIT_FOR_CHALLENGE_CONFIRMATION:
        return <WaitForChallengeConfirmation />;
      case states.WAIT_FOR_RESPONSE_OR_TIMEOUT:
        return <WaitForResponseOrTimeout expirationTime={100 /*todo*/} />;
      case states.ACKNOWLEDGE_CHALLENGE_RESPONSE:
        return (
          <AcknowledgeChallengeResponse
            challengeResponseAcknowledged={challengeResponseAcknowledged}
          />
        );
      case states.ACKNOWLEDGE_CHALLENGE_TIMEOUT:
        return (
          <AcknowledgeChallengeTimeout
            expirationTime={100 /*todo*/}
            withdrawalRequested={withdrawalRequested}
          />
        );
      default:
        return unreachable(state);
    }
  }
}
const mapDispatchToProps = {
  withdrawalRequested: actions.withdrawalRequested,
  challengeResponseAcknowledged: actions.challengeResponseAcknowledged,
  challengeApproved: actions.challengeApproved,
  challengeRejected: actions.challengeRejected,
};

// why does it think that mapStateToProps can return undefined??

export default connect(
  () => ({}),
  mapDispatchToProps,
)(ChallengingContainer);

