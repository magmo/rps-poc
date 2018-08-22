import BasePlayerB from './Base';

export default class ReadyToDeposit extends BasePlayerB {
  transaction;
  readonly isReadyToSend = true;
  readonly funded = false;
  constructor({ transaction }) {
    super();
    this.transaction = transaction;
  }
}
