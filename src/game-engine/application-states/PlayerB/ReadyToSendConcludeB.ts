import BasePlayerB from './Base';
import { Position } from '../../positions';

export default class ReadyToSendConcludeB extends BasePlayerB {
  position: Position;
  adjudicator: string;
  readonly isReadyToSend = true;

  constructor({ channel, balances, adjudicator, position }) {
    super({ channel, balances, stake: 0 });
    this.position = position;
    this.adjudicator = adjudicator;
  }
}
