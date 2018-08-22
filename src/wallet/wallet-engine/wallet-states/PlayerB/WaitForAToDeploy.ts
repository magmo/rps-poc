import BasePlayerB from './Base';


export default class WaitForAToDeploy extends BasePlayerB {
  transaction;
  readonly funded = false;
  readonly isReadyToSend = false;
  constructor({ transaction }) {
    super();
    this.transaction = transaction;
  }
}
