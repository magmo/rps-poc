import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import { Challenge } from '../redux/application/reducer';

import Button from './Button';

interface Props {
  challenges: Challenge[],
  acceptChallenge: (address: string, stake: number) => void,
  autoOpponentAddress: string,
}

export default class SelectChallenge extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      challenges,
      acceptChallenge,
      autoOpponentAddress,
    } = this.props;

    return (
      <React.Fragment>
        <h1>Select an opponent:</h1>
        <div className={css(styles.centeredTable)}>
          <table className={css(styles.leftAlign)}>
            <tbody>
              <tr className={css(styles.titleRow)}>
                <th>Name</th>
                <th>Wager (Finney)</th>
                <th>Time initiated</th>
              </tr>
              <tr key={autoOpponentAddress}>
                <td>RockBot 🤖 </td>
                <td>30</td>
                <td>
                  <Button onClick={() => acceptChallenge(autoOpponentAddress, 30)}>Challenge</Button>
                </td>
              </tr>
              {challenges.map(challenge => (
                <tr key={challenge.address}>
                  <td>{challenge.name}</td>
                  <td>{challenge.stake}</td>
                  <td>
                    <Button onClick={() => acceptChallenge(challenge.address, challenge.stake)}>Challenge</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
