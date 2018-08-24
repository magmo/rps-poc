import React from 'react';
import { StyleSheet, css } from 'aphrodite';

interface Props {
  message: string;
}

export default class ProposeGamePage extends React.PureComponent<Props> {
  render() {
    return (
      <div className={css(styles.container)}>
        <div>
          <h1>Game Proposed</h1>

          <div>Waiting for your opponent to accept the game!</div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '90%',
    margin: 'auto',
  },

  fullWidth: {
    width: '100%',
  },
});
