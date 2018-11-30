import React from 'react';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';
import YesOrNo from '../YesOrNo';

export interface Props {
  fundingApproved: () => void;
  fundingRejected: () => void;
}

export default class ApproveFunding extends React.Component<Props> {
  render() {
    const {
      fundingApproved,
      fundingRejected,
    } = this.props;
    return (
      <SidebarLayout>
        <img src={walletIcon} />

        <div className="challenge-expired-title">
          Fund your channel!
        </div>
        <p>Do you wish to open this channel?</p>

        <YesOrNo yesAction={fundingApproved} noAction={fundingRejected} />

      </SidebarLayout>
    );
  }
}
