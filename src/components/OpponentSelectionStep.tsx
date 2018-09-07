import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import { Opponent } from '../redux/reducers/opponents';

import Button from './Button';

interface Props {
  chooseOpponent: (opponentAddress: string, stake: number) => void;
  playComputer: (stake: number) => void;
  opponents: Opponent[];
  currentPlayer?: {
    address: string;
    name: string;
  };
}

const DEFAULT_WAGER = 50;

export default class OpponentSelectionStep extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { opponents, chooseOpponent, playComputer } = this.props;

    return (
      <React.Fragment>
        <h1>Select an opponent:</h1>
        <div className={css(styles.centeredTable)}>
          <table className={css(styles.leftAlign)}>
            <tbody>
              <tr className={css(styles.titleRow)}>
                <th>Name</th>
                <th>Last Seen</th>
                <th>Wager</th>
                <th>Action</th>
              </tr>
              {opponents.map(opponent => (
                <tr key={opponent.address}>
                  <td>{opponent.name}</td>
                  <td>{(new Date(opponent.lastSeen)).toUTCString()}</td>
                  <td>{DEFAULT_WAGER}</td>
                  <td>
                    <Button onClick={() => chooseOpponent(opponent.address, DEFAULT_WAGER)}>Challenge</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={css(styles.buttonPosition)}>
            <Button onClick={() => playComputer(DEFAULT_WAGER)}>Play against computer</Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  centeredTable: {
    left: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
  },

  leftAlign: {
    textAlign: 'left',
  },

  buttonPosition: {
    textAlign: 'center',
    padding: '20px',
  },

  titleRow: {
    height: 60,
  },
});
