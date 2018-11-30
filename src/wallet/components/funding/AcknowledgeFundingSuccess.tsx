import React from 'react';
import Button from 'reactstrap/lib/Button';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';

interface Props {
  fundingSuccessAcknowledged: () => void;
}

export default class AcknowledgeFundingSuccess extends React.PureComponent<Props> {
  render() {
    const { fundingSuccessAcknowledged } = this.props;
    return (
      <SidebarLayout>
        <img src={walletIcon} />
        <div className="challenge-expired-title">
          Funding successful!
        </div>
        <p>
          You have successfully deposited funds into your channel.
        </p>
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={fundingSuccessAcknowledged} >
            Return to game
          </Button>
        </div>
      </SidebarLayout>
    );
  }
}
