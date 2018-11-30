import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForDepositConfirmation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Waiting for the blockchain</h1>
        <p>
          Waiting for the miners to add the deposit to the blockchain.
        </p>
      </SidebarLayout>
    );
  }
}
