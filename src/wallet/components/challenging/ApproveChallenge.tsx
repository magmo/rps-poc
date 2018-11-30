import React from 'react';
import Button from 'reactstrap/lib/Button';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';

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
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={challengeApproved} >
            Yes
          </Button>
          <Button className="challenge-expired-button" onClick={challengeRejected} >
            No
          </Button>
        </div>
      </SidebarLayout>
    );
  }
}
