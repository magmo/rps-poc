import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as states from '../states';
import * as actions from '../redux/actions';

import ApproveWithdrawal from '../components/withdrawing/ApproveWithdrawal';
import AcknowledgeWithdrawalSuccess from '../components/withdrawing/AcknowledgeWithdrawalSuccess';
import WaitForWithdrawalInitiation from '../components/withdrawing/WaitForWithdrawalInitiation';
import WaitForWithdrawalConfirmation from '../components/withdrawing/WaitForWithdrawalConfirmation';
import { unreachable } from '../utils/reducer-utils';

interface Props {
  state: states.WithdrawingState;
  withdrawalApproved: (destinationAddress: string) => void;
  withdrawalRejected: () => void;
  withdrawalSuccessAcknowledged: () => void;
}

class WithdrawingContainer extends PureComponent<Props> {
  render() {
    const {
      state,
      withdrawalApproved,
      withdrawalRejected,
      withdrawalSuccessAcknowledged,
    } = this.props;

    switch (state.type) {
      case states.APPROVE_WITHDRAWAL:
        return (
          <ApproveWithdrawal
            withdrawalApproved={withdrawalApproved}
            withdrawalRejected={withdrawalRejected}
          />
        );
      case states.WAIT_FOR_WITHDRAWAL_INITIATION:
        return <WaitForWithdrawalInitiation />;
      case states.WAIT_FOR_WITHDRAWAL_CONFIRMATION:
        return <WaitForWithdrawalConfirmation />;
      case states.ACKNOWLEDGE_WITHDRAWAL_SUCCESS:
        return (
          <AcknowledgeWithdrawalSuccess
            withdrawalSuccessAcknowledged={withdrawalSuccessAcknowledged}
          />
        );
      default:
        return unreachable(state);
    }
  }
}

const mapDispatchToProps = {
  withdrawalApproved: actions.withdrawalApproved,
  withdrawalRejected: actions.withdrawalRejected,
  withdrawalSuccessAcknowledged: actions.withdrawalSuccessAcknowledged,
};

// why does it think that mapStateToProps can return undefined??

export default connect(
  () => ({}),
  mapDispatchToProps,
)(WithdrawingContainer);
