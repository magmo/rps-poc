import BasePlayerB from './Base';
import Move from '../../Move';

export default class ReadyToSendPreFundSetupB extends BasePlayerB {
  move: Move;

  constructor({ channel, stake, balances, move }) {
    super({ channel, stake, balances });
    this.move = move;
  }
}
