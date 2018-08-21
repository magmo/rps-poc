import BasePlayerB from './Base';

export default class InsufficientFundsB extends BasePlayerB {
  adjudicator: any;
  readonly isReadyToSend = false;

  constructor({ channel, balances, adjudicator }) {
    super({ channel, balances, stake: 0 });
    this.adjudicator = adjudicator;
  }
}
