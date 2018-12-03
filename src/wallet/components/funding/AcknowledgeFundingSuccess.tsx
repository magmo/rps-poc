import React from 'react';
import AcknowledgeX from '../AcknowledgeX';

interface Props {
  fundingSuccessAcknowledged: () => void;
}

export default class AcknowledgeFundingSuccess extends React.PureComponent<Props> {
  render() {
    const { fundingSuccessAcknowledged } = this.props;
    return (
      <AcknowledgeX
        title="Funding successful!"
        action={fundingSuccessAcknowledged}
        description="You have successfully deposited funds into your channel"
        actionTitle="Return to game"
      />
    );
  }
}
