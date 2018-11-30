import React from 'react';
import SidebarLayout from '../SidebarLayout';

export default class WaitForWithdrawalInitiation extends React.PureComponent<{}> {
  render() {
    return (
      <SidebarLayout>
        <h1>Preparing your withdrawal!</h1>
        <p>
          Your withdrawal will be sent to MetaMask very soon. So soon, in fact,
          that if you have time to read this, there's a good chance something
          has gone wrong 😕.
        </p>
      </SidebarLayout>
    );
  }
}
