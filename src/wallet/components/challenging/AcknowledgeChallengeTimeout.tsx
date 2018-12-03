import React from 'react';
import AcknowledgeX from '../AcknowledgeX';

interface Props {
  expirationTime: number;
  withdrawalRequested: () => void;
}

export default class AcknowledgeChallengeTimeout extends React.PureComponent<Props> {

  render() {
    const { expirationTime, withdrawalRequested } = this.props;
    const parsedExpiryDate = new Date(expirationTime * 1000).toLocaleTimeString();
    const description = `The challenge expired at ${parsedExpiryDate}. You may now withdraw your funds.`;
    return (
      <AcknowledgeX
        title="A challenge has expired"
        description={description}
        action={withdrawalRequested}
        actionTitle="Withdraw your funds"
      />
    );
  }
}
