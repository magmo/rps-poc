import BasePlayerB from './Base';

export default class Funded extends BasePlayerB {
  readonly isReadyToSend = false;
  readonly funded = true;
  adjudicator: string;

  constructor({ adjudicator }) {
    super();
    this.adjudicator = adjudicator;
  }
}
