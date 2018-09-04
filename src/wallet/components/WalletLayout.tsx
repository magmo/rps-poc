import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default class WalletLayout extends React.PureComponent<Props> {
  render() {
    return (
      <div className="container">
        {/* TODO: make this a modal */}
        <div>
          <h3>Channel Wallet</h3>
          <p>{this.props.children}</p>
        </div>
      </div>
    );
  }
}
