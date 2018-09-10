import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { MetamaskError } from '../redux/metamask/actions';

interface MetamaskErrorProps {
  error: MetamaskError;
}

export default function MetamaskErrorPage(props: MetamaskErrorProps) {
  const networksTypes = {
    1: 'mainnet',
    2: 'morden',
    3: 'ropsten',
    42: 'kovan',
    4: 'rinkeby',
  };
  let message = "Metamask doesn't appear to be installed.";
  if (props.error.errorType === 'WrongNetwork' && props.error.networkId) {
    const type = networksTypes[props.error.networkId] || 'development';
    message = `The wrong network is selected in metamask. Please select the ${type} network in metamask.`;
  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.headerText)}>
        <h1 className={css(styles.title)}>Metamask Error</h1>
        <p>
          <em>{message}</em>
        </p>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '90%',
    margin: 'auto',
  },
  headerText: {
    textAlign: 'center',
    paddingBottom: 32,
  },

  title: {
    marginBottom: 0,
  },
});
