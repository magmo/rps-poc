import BaseState from '../Base';
import { Error, AdjudicatorReceived, PreFunding, Position } from '../../positions';
import Default from '../../positions/Default';

class BasePlayerA<T extends Position> extends BaseState<T> {
  readonly playerIndex = 0;
}

export class Funded extends BasePlayerA<Default> {
  constructor() {
    super(new Default());
  }
}
export class FundingFailed extends BasePlayerA<Error> {}
export class ReadyToDeploy extends BasePlayerA<Default> {
  constructor() {
    super(new Default());
  }
}
export class WaitForApproval extends BasePlayerA<PreFunding> {}
export class WaitForBlockchainDeploy extends BasePlayerA<Default> {
  constructor() {
    super(new Default());
  }
}
export class WaitForBToDeposit extends BasePlayerA<AdjudicatorReceived> {}

export type PlayerAState =
  | Funded
  | FundingFailed
  | ReadyToDeploy
  | WaitForApproval
  | WaitForBlockchainDeploy
  | WaitForBToDeposit;
