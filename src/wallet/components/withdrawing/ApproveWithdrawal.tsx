import React from 'react';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';
import YesOrNo from '../YesOrNo';

export interface Props {
  withdrawalApproved: (destinationAddress: string) => void;
  withdrawalRejected: () => void;
}

export default class ApproveWithdrawal extends React.Component<Props> {
  render() {
    const {
      withdrawalApproved,
      withdrawalRejected,
    } = this.props;
    return (
      <SidebarLayout>
        <img src={walletIcon} />

        <div className="challenge-expired-title">
          Withdraw your funds
        </div>
        <p>Do you wish to withdraw your funds from this channel?</p>

        <YesOrNo yesAction={() => withdrawalApproved('todo address')} noAction={withdrawalRejected} />

      </SidebarLayout>
    );
  }
}
