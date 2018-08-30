import BasePlayerA from './Base';
import { Position } from '../../positions';

export default class ReadyToSendPostFundSetupA extends BasePlayerA {
  adjudicator: string; // address
  position: Position;
  readonly isReadyToSend = true;

  constructor({ channel, stake, balances, adjudicator, position }) {
    super({ channel, stake, balances });
    this.adjudicator = adjudicator;
    this.position = position;
  }
}
