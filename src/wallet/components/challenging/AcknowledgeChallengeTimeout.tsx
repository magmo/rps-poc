import React from 'react';
import Button from 'reactstrap/lib/Button';
import walletIcon from '../../../images/wallet_icon.svg';
import SidebarLayout from '../SidebarLayout';

interface Props {
  expirationTime: number;
  withdrawalRequested: () => void;
}

export default class AcknowledgeChallengeTimeout extends React.PureComponent<Props> {

  render() {
    const { expirationTime, withdrawalRequested } = this.props;
    const parsedExpiryDate = new Date(expirationTime * 1000).toLocaleTimeString();
    return (
      <SidebarLayout>
        <img src={walletIcon} />
        <div className="challenge-expired-title">A challenge has expired</div>
        <p>The challenge expired at {parsedExpiryDate}. You may now withdraw your funds.</p>
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={() => { withdrawalRequested(); }} >Withdraw</Button>
          </div>
      </SidebarLayout>
    );
  }
}
