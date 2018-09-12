import BaseState from '../Base';
import { Error, AdjudicatorReceived, PreFunding, Position } from '../../positions';
import Default from '../../positions/Default';

class BasePlayerB<T extends Position> extends BaseState<T> {
  readonly playerIndex = 1;
}

export class Funded extends BasePlayerB<Default> {
  constructor() {
    super(Default);
  }
}
export class FundingFailed extends BasePlayerB<Error> {}
export class ReadyToDeposit extends BasePlayerB<AdjudicatorReceived> {}
export class WaitForApproval extends BasePlayerB<PreFunding> {}
export class WaitForAToDeploy extends BasePlayerB<Default> {
  constructor() {
    super(Default);
  }
}
export class WaitForApprovalWithAdjudicator extends BasePlayerB<PreFunding> {
  adjudicatorAddress: string;
  constructor(position: PreFunding, adjudicatorAddress: string) {
    super(position);
    this.adjudicatorAddress = adjudicatorAddress;
  }
}

export class WaitForBlockchainDeposit extends BasePlayerB<AdjudicatorReceived> {}

export type PlayerBState =
  | Funded
  | FundingFailed
  | ReadyToDeposit
  | WaitForAToDeploy
  | WaitForBlockchainDeposit;
