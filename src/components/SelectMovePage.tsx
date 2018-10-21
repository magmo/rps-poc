import React from 'react';

import { Move } from '../core';

import { Button } from 'reactstrap';
import MoveIcon from './MoveIcon';

interface Props {
  chooseMove: (move: Move) => void;
  abandonGame: () => void;
  afterOpponent?: any;
  challengeExpirationDate?:number;

}

export default class SelectMoveStep extends React.PureComponent<Props> {
  renderChooseButton(chooseMove: (move: Move) => void, move: Move, description: string) {
    return (
      <Button onClick={() => chooseMove(move)} color="light" className="w-75 p-3">
        <div className="mb-3">
          <h1>{description}</h1>
          <MoveIcon move={move} />
        </div>
      </Button>
    );
  }

  render() {
    const { afterOpponent, chooseMove, abandonGame, challengeExpirationDate } = this.props;
    const renderChooseButton = this.renderChooseButton;

    return (
      <div className="container centered-container">
        <div className="w-100 text-center mb-5">
          <h1 className="mb-5">
          {challengeExpirationDate && `Challenge detected, respond by ${new Date(challengeExpirationDate).toString()}` }
            {afterOpponent
              ? 'Your opponent has chosen a move, now choose yours:'
              : 'Choose your move:'}
          </h1>
          <div className="row w-100">
            <div className="col-sm-4">{renderChooseButton(chooseMove, Move.Rock, 'Rock')}</div>
            <div className="col-sm-4">{renderChooseButton(chooseMove, Move.Paper, 'Paper')}</div>
            <div className="col-sm-4">
              {renderChooseButton(chooseMove, Move.Scissors, 'Scissors')}
            </div>
          </div>
          <div className="mt-5">
            <Button onClick={() => abandonGame()} color="dark" className="w-75 p-3">
              <h1>Abandon game</h1>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}