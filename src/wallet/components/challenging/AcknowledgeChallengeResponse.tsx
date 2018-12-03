import React from 'react';
import AcknowledgeX from '../AcknowledgeX';

interface Props {
  challengeResponseAcknowledged: () => void;
}

export default class AcknowledgeChallengeResponse extends React.PureComponent<Props> {
  render() {
    const { challengeResponseAcknowledged } = this.props;
    return (
      <AcknowledgeX
        title="Challenge over!"
        action={challengeResponseAcknowledged}
        description="Your opponent responded to the challenge."
        actionTitle="Return to game"
      />
    );
  }
}
