import BasePlayerB from './Base';
import { Position } from '../../positions';

export default class ReadyToSendPostFundSetupB extends BasePlayerB {
  adjudicator: string;
  position: Position;
  readonly isReadyToSend = true;

  constructor({ channel, stake, balances, adjudicator, position }) {
    super({ channel, stake, balances });
    this.position = position;
    this.adjudicator = adjudicator;
  }
}
