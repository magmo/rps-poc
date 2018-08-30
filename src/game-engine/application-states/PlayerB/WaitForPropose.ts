import BasePlayerB from './Base';
import { Position } from '../../positions';

export default class WaitForPropose extends BasePlayerB {
  position: Position;
  adjudicator: string;
  readonly isReadyToSend = false;

  constructor({ channel, stake, balances, adjudicator, position }) {
    super({ channel, stake, balances });
    this.position = position;
    this.adjudicator = adjudicator;
  }
}
