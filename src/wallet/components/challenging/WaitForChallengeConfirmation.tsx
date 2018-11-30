import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForChallengeConfirmation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Waiting for your challenge to be mined!</h1>
        <p>
          Hold tight! Visit <a>this link [TODO]</a> to check on its status.
        </p>
      </SidebarLayout>
    );
  }
}
