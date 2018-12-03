import React from 'react';
import AcknowledgeX from '../AcknowledgeX';

interface Props {
  challengeAcknowledged: () => void;
}

export default class AcknowledgeChallenge extends React.PureComponent<Props> {
  render() {
    return (
      <AcknowledgeX
        title="Challenge detected!"
        description="Your opponent has challenged you on-chain."
        action={this.props.challengeAcknowledged}
        actionTitle="Proceed"
      />
    );
  }
}
