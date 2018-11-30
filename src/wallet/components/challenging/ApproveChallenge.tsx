import React from 'react';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';
import YesOrNo from '../YesOrNo';

interface Props {
  challengeApproved: () => void;
  challengeRejected: () => void;
}

export default class ApproveChallenge extends React.PureComponent<Props> {

  render() {
    const { challengeApproved, challengeRejected } = this.props;
    return (
      <SidebarLayout>
        <img src={walletIcon} />
        <div className="challenge-expired-title">Launch a challenge!</div>
        <p>You've selected to launch an on-chain challenge. Do you want to proceed?</p>

        <YesOrNo yesAction={challengeApproved} noAction={challengeRejected} />
      </SidebarLayout>
    );
  }
}
