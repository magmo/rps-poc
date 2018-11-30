import React from 'react';
import SidebarLayout from '../SidebarLayout';


export default class BWaitForDeployInitiation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Waiting!</h1>
        <p>
          Waiting for your opponent to deploy the adjudicator to the blockchain.
        </p>
      </SidebarLayout>
    );
  }
}
