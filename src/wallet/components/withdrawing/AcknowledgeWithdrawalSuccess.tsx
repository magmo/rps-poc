import React from 'react';
import AcknowledgeX from '../AcknowledgeX';

interface Props {
  withdrawalSuccessAcknowledged: () => void;
}

export default class AcknowledgeWithdrawalSuccess extends React.PureComponent<Props> {
  render() {
    const { withdrawalSuccessAcknowledged } = this.props;
    return (
      <AcknowledgeX
        title="Withdrawal successful!"
        description="You have successfully withdrawn your funds."
        action={withdrawalSuccessAcknowledged}
        actionTitle="Return to app"
      />
    );
  }
}
