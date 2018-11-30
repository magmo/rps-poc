import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForChallengeInitiation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Preparing your challenge!</h1>
        <p>
          Your challenge will be sent to MetaMask very soon. So soon, in fact,
          that if you have time to read this, there's a good chance something
          has gone wrong 😕.
        </p>
      </SidebarLayout>
    );
  }
}
