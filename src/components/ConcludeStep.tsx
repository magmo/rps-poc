import React from 'react';

import Button from './Button';

interface IProps {
  handleReturnToOpponentSelection: () => any;
  winnings: string;
}

export default class ConcludeStep extends React.PureComponent<IProps> {
  render() {
    const { handleReturnToOpponentSelection, winnings } = this.props;

    return (
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <h1>The game has concluded.</h1>
        <h3 style={{ width: '100%', paddingBottom: 16 }}>{`You've won ${winnings} Finney!`}</h3>
        <Button onClick={handleReturnToOpponentSelection}>Return to opponent selection</Button>
      </div>
    );
  }
}
