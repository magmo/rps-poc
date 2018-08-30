import PlayerABase from './Base';
import { Position } from '../../positions';

export default class ReadyToSendConcludeA extends PlayerABase {
  adjudicator: any;
  position: Position;
  readonly isReadyToSend = true;

  constructor({ channel, balances, adjudicator }) {
    super({ channel, balances, stake: 0});
    this.adjudicator = adjudicator;
  }
}
