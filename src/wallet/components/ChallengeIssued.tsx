import React from 'react';
import walletHeaderIcon from '../../images/wallet_header_icon.svg';

export interface Props {
  loginDisplayName;
  expirationTime;
}

export default class WalletMessage extends React.Component<Props>{

  parsedExpiryDateTime() {
    return new Date(this.props.expirationTime * 1000).toLocaleTimeString();
  }

  render() {
    const parsedExpiryDateTime = this.parsedExpiryDateTime;
    return (
      <div className="message-container">
        <div className="message-header">
          <img src={walletHeaderIcon} className="message-header-icon" />
          <div className="message-circle">
            <div className="message-user">{this.getInitials(this.props.loginDisplayName)}</div>
          </div>
        </div>
        <div className="message-text">
          <div className="message-title">Challenge Issued</div>
          <div>
            <p>Your challenge has been issued.</p>
            <p>The game will automatically conclude by {parsedExpiryDateTime} if no action is taken.</p>
          </div>
        </div>
      </div>
    );
  }

  getInitials(loginDisplayName: string): string {
    const userDisplayName = loginDisplayName.split(" ");
    return userDisplayName.map(name => name.charAt(0)).join("");
  }
}
