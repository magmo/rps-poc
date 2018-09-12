import * as State from './wallet-states/PlayerB';
import { PreFunding, AdjudicatorReceived } from './positions';

export default class WalletEngineB {
  static setupWalletEngine({ myAddress, opponentAddress, myBalance, opponentBalance }) {
    const newPosition = new PreFunding({ myAddress, opponentAddress, myBalance, opponentBalance });

    const walletState = new State.WaitForApproval(newPosition);
    return new WalletEngineB(walletState);
  }
  state: any;

  constructor(state) {
    this.state = state;
  }

  approve(): State.PlayerBState {
    switch (this.state.constructor) {
      case State.WaitForApproval:
        return this.transitionTo(new State.WaitForAToDeploy());
      case State.WaitForApprovalWithAdjudicator:
      const newPosition = new AdjudicatorReceived(this.state.adjudicatorAddress);
        return this.transitionTo(new State.ReadyToDeposit(newPosition));
      default:
        return this.state;
    }
  }

  errorOccurred(message: string): State.PlayerBState {
    if (this.state.constructor === State.ReadyToDeposit) {
      const newPosition = new Error(message);
      return this.transitionTo(new State.FundingFailed(newPosition));
    } else {
      return this.state;
    }
  }

  deployConfirmed(adjudicator): State.PlayerBState {
    switch (this.state.constructor) {
      case State.WaitForAToDeploy:
        const newPosition = new AdjudicatorReceived(adjudicator);
        return this.transitionTo(new State.ReadyToDeposit(newPosition));
      case State.WaitForApproval:
        // We store the adjudicator in the state and keep the current position
        const position = this.state.position;
        return this.transitionTo(
          new State.WaitForApprovalWithAdjudicator(position, adjudicator),
        );
      default:
        return this.state;
    }
  }

  transactionConfirmed(): State.PlayerBState {
    if (
      this.state.constructor === State.WaitForBlockchainDeposit ||
      this.state.constructor === State.FundingFailed
    ) {
      return this.transitionTo(new State.Funded());
    } else {
      return this.state;
    }
  }

  transactionSent() {
    if (this.state.constructor === State.ReadyToDeposit) {
      const { adjudicator } = this.state;
      const newPosition: AdjudicatorReceived = {
        adjudicatorAddress: adjudicator,
      };
      return this.transitionTo(new State.WaitForBlockchainDeposit(newPosition));
    } else {
      return this.state;
    }
  }

  transitionTo(state): State.PlayerBState {
    this.state = state;
    return state;
  }
}
