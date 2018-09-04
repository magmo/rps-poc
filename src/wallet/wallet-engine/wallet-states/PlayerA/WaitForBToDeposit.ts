import BasePlayerA from './Base';

export default class WaitForBToDeposit extends BasePlayerA {
  adjudicator: string;
  readonly isReadyToSend = false;
  readonly isFunded = false;
  constructor({ adjudicator }) {
    super();
    this.adjudicator = adjudicator;
  }
}
