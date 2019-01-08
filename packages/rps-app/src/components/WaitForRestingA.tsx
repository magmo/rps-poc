import * as React from 'react';

import { Move, Result } from '../core';
import { MoveBadge } from './MoveBadge';
import { GameLayout } from './GameLayout';

interface Props {
  yourMove: Move;
  theirMove: Move;
  result: Result;
  playAgain: () => void;
}

export default class WaitForRestingA extends React.PureComponent<Props> {
  renderResultText() {
    const { result } = this.props;

    switch (result) {
      case Result.YouWin:
        return 'You won! 🎉';

      case Result.YouLose:
        return 'You lost 😭';

      default:
        return "It's a tie! 🙄";
    }
  }

  render() {
    const { yourMove, theirMove } = this.props;

    return (
      <GameLayout>
        <div className="w-100 text-center">
          <h1 className="mb-5">{this.renderResultText()}</h1>
          <div className="row">
            <div className="col-sm-6">
              <p className="lead">
                You chose <strong>{Move[yourMove]}</strong>
              </p>
              <div>
                <MoveBadge move={yourMove} />
              </div>
            </div>
            <div className="col-sm-6">
              <p className="lead">
                Your opponent chose <strong>{Move[theirMove]}</strong>
              </p>
              <div>
                <MoveBadge move={theirMove} />
              </div>
            </div>
          </div>

          <div> Waiting for opponent to confirm </div>
        </div>
      </GameLayout>
    );
  }
}
