import React from 'react';
import Button from 'reactstrap/lib/Button';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';

interface Props {
  challengeResponseAcknowledged: () => void;
}

export default class AcknowledgeChallengeResponse extends React.PureComponent<Props> {
  render() {
    return (
      <SidebarLayout>
        <img src={walletIcon} />
        <div className="challenge-expired-title">
          Challenge over!
        </div>
        <p>
          Your opponent responded to the challenge
        </p>
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={this.props.challengeResponseAcknowledged} >
            Return to game
          </Button>
        </div>
      </SidebarLayout>
    );
  }
}
