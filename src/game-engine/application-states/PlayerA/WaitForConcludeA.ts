import BasePlayerA from './Base';
import { Position } from '../../positions';

export default class WaitForConcludeA extends BasePlayerA {
  adjudicator: any;
  position: Position;
  readonly isReadyToSend = false;

  constructor({ channel, balances, adjudicator, position }) {
    super({ channel, balances, stake: 0 });
    this.adjudicator = adjudicator;
    this.position = position;
  }
}
