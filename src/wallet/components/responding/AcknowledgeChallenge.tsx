import React from 'react';
import Button from 'reactstrap/lib/Button';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';

interface Props {
  challengeAcknowledged: () => void;
}

export default class AcknowledgeChallenge extends React.PureComponent<Props> {
  render() {
    return (
      <SidebarLayout>
        <img src={walletIcon} />
        <div className="challenge-expired-title">
          Challenge detected!
        </div>
        <p>
          Your opponent has challenged you on-chain!
        </p>
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={this.props.challengeAcknowledged} >
            Proceed
          </Button>
        </div>
      </SidebarLayout>
    );
  }
}
