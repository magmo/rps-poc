import BasePlayerA from './Base';
import { Position } from '../../positions';

export default class WaitForPostFundSetupB extends BasePlayerA {
  adjudicator: string; // address
  position: Position;
  readonly isReadyToSend = false;

  constructor({ channel, stake, balances, adjudicator, position }) {
    super({ channel, stake, balances });
    this.adjudicator = adjudicator;
    this.position = position;
  }
}
