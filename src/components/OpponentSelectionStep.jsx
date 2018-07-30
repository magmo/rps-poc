import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

const propTypes = {
  proposeGame: PropTypes.func.isRequired,
  opponents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      wager: PropTypes.string.isRequired,
    }),
  ),
};

export default class OpponentSelectionStep extends React.PureComponent {
  render() {
    const { opponents, proposeGame } = this.props;

    return (
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <div>
          <h1>Select an opponent:</h1>
        </div>
        <div
          style={{
            left: '50%',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }}
        >
          <table style={{ textAlign: 'left' }}>
            <tbody>
              <tr style={{ height: 60 }}>
                <th>Name</th>
                <th>Wager (Finney)</th>
                <th>Time initiated</th>
                <th />
              </tr>
              {opponents.map(opponent => (
                <tr key={opponent.id}>
                  <td>{opponent.name}</td>
                  <td>{opponent.wager}</td>
                  <td>{opponent.timestamp}</td>
                  <td>
                    <Button
                      onClick={() => proposeGame(opponent.address)}
                    >
                      Challenge
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

OpponentSelectionStep.propTypes = propTypes;
