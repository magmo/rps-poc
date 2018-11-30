import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { unreachable } from '../utils';

import * as states from '../states';
import * as actions from '../redux/actions';

import ApproveFunding from '../components/funding/ApproveFunding';
import AInitiateDeploy from '../components/funding/AInitiateDeploy';
import BWaitForDeployInitiation from '../components/funding/BWaitForDeployInitiation';
import WaitForDeployConfirmation from '../components/funding/WaitForDeployConfirmation';
import BInitiateDeposit from '../components/funding/BInitiateDeposit';
import AWaitForDepositInitiation from '../components/funding/AWaitForDepositInitiation';
import BWaitForPostFundSetup from '../components/funding/BWaitForPostFundSetup';
import AWaitForPostFundSetup from '../components/funding/AWaitForPostFundSetup';
import AcknowledgeFundingSuccess from '../components/funding/AcknowledgeFundingSuccess';

interface Props {
  state: states.FundingState;
  fundingApproved: () => void;
  fundingRejected: () => void;
  fundingSuccessAcknowledged: () => void;
}

class FundingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      fundingApproved,
      fundingRejected,
      fundingSuccessAcknowledged,
    } = this.props;

    switch (state.type) {
      case states.WAIT_FOR_FUNDING_REQUEST:
        return null;
      case states.APPROVE_FUNDING:
        return (
          <ApproveFunding
            fundingApproved={fundingApproved}
            fundingRejected={fundingRejected}
          />
        );
      case states.A_INITIATE_DEPLOY:
        return <AInitiateDeploy />;
      case states.B_WAIT_FOR_DEPLOY_INITIATION:
        return <BWaitForDeployInitiation />;
      case states.WAIT_FOR_DEPLOY_CONFIRMATION:
        return <WaitForDeployConfirmation />;
      case states.B_INITIATE_DEPOSIT:
        return <BInitiateDeposit />;
      case states.A_WAIT_FOR_DEPOSIT_INITIATION:
        return <AWaitForDepositInitiation />;
      case states.WAIT_FOR_DEPOSIT_CONFIRMATION:
        return <WaitForDeployConfirmation />;
      case states.B_WAIT_FOR_POST_FUND_SETUP:
        return <BWaitForPostFundSetup />;
      case states.A_WAIT_FOR_POST_FUND_SETUP:
        return <AWaitForPostFundSetup />;
      case states.ACKNOWLEDGE_FUNDING_SUCCESS:
        return (
          <AcknowledgeFundingSuccess
            fundingSuccessAcknowledged={fundingSuccessAcknowledged}
          />
        );
      default:
        return unreachable(state);
    }
  }
}

const mapDispatchToProps = {
  fundingApproved: actions.fundingApproved,
  fundingRejected: actions.fundingRejected,
  fundingSuccessAcknowledged: actions.fundingSuccessAcknowledged,
};

// why does it think that mapStateToProps can return undefined??

export default connect(
  () => ({}),
  mapDispatchToProps,
)(FundingContainer);
