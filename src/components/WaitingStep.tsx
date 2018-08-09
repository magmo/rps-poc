import React from 'react';
import PropTypes from 'prop-types';

import { Play } from '../game-engine/pledges/';

const propTypes = {
  message: PropTypes.string.isRequired,
  selectedPlayId: PropTypes.number,
};

const defaultProps = {
  selectedPlayId: null,
};

interface Props {
  message: string;
  selectedPlayId?: number;
}

export default class WaitingStep extends React.PureComponent<Props> {
  render() {
    const { message, selectedPlayId } = this.props;

    return (
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <div>
          <h1>Waiting for { message }...</h1>
        </div>
        {selectedPlayId && (
          <div style={{ width: '100%' }}>
            You&apos;ve chosen {Play[selectedPlayId]} 
          </div>
        )}
      </div>
    );
  }

  get propTypes() {
    return propTypes;
  }

  get defaultProps() {
    return defaultProps;
  }
}