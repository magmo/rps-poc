import React from 'react';

import { Move } from '../core';
import MoveIcon from './MoveIcon';
import Button from 'reactstrap/lib/Button';

interface Props {
  message: string;
  yourPlay: Move;
  createBlockchainChallenge: ()=>void;
}

export default class PlaySelectedPage extends React.PureComponent<Props> {
  static defaultProps = {
    selectedPlayId: null,
  };

  render() {
    const { message, yourPlay, createBlockchainChallenge } = this.props;

    return (
      <div className="container centered-container">
        <div className="w-100 text-center mb-5">
          <h1 className="mb-5">Move chosen!</h1>
          <p className="lead">
            You chose <strong>{Move[yourPlay]}</strong>
          </p>

          <div className="mb-5">
            <MoveIcon move={yourPlay} />`
          </div>
          <Button onClick={createBlockchainChallenge}>Challenge</Button>
          <p>{message}</p>
        </div>
      </div>
    );
  }
}