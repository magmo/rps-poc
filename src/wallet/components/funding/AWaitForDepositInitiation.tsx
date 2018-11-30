import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class AWaitForDepositInitiation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Waiting!</h1>
        <p>
          Waiting for your opponent to send their challenge to the blockchain.
        </p>
      </SidebarLayout>
    );
  }
}
