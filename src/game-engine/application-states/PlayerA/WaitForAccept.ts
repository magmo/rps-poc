import BasePlayerA from './Base';
import { Position } from '../../positions';
import { Play } from '../../positions';

export default class WaitForAccept extends BasePlayerA {
  position: Position;
  aPlay: Play;
  salt: string;
  adjudicator: string;
  readonly isReadyToSend = false;

  constructor({ channel, stake, balances, adjudicator, aPlay, salt, position }) {
    super({ channel, stake, balances });
    this.position = position;
    this.aPlay = aPlay;
    this.salt = salt;
    this.adjudicator = adjudicator;
  }
}
