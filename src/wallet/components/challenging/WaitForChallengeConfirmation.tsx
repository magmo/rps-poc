import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForChallengeConfirmation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Waiting for Challenge Creation</h1>
        <p>
          Waiting for the challenge transaction to be recorded.
        </p>
      </SidebarLayout>
    );
  }
}
