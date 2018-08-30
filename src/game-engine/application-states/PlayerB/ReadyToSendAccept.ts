import BasePlayerB from './Base';
import { Position } from '../../positions';
import { Play } from '../../positions';

export default class ReadyToSendAccept extends BasePlayerB {
  position: Position;
  adjudicator: string;
  bPlay: Play;
  readonly isReadyToSend = true;

  constructor({ channel, stake, balances, adjudicator, bPlay, position }) {
    super({ channel, stake, balances });
    this.position = position;
    this.adjudicator = adjudicator;
    this.bPlay = bPlay;
  }
}
