import BasePlayerB from './Base';
import { Position } from '../../positions';
import { Play } from '../../positions';

export default class WaitForReveal extends BasePlayerB {
  position: Position;
  bPlay: Play;
  adjudicator: string;
  readonly isReadyToSend = false;

  constructor({ channel, stake, balances, adjudicator, bPlay, position }) {
    super({ channel, stake, balances });
    this.position = position;
    this.adjudicator = adjudicator;
    this.bPlay = bPlay;
  }
}
