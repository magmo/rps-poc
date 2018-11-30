import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForChallengeSubmission extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Sending your challenge to the blockchain!</h1>
        <p>
          Please confirm the transaction in MetaMask.
        </p>
      </SidebarLayout>
    );
  }
}
