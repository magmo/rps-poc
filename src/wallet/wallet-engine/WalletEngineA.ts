import * as State from './wallet-states/PlayerA';
import { PreFunding, AdjudicatorReceived, Error } from './positions';
export default class WalletEngineA {
  static setupWalletEngine({ myAddress, opponentAddress, myBalance, opponentBalance }) {
    const newPosition = new PreFunding({ myAddress, opponentAddress, myBalance, opponentBalance });

    const walletState = new State.WaitForApproval(newPosition);
    return new WalletEngineA(walletState);
  }

  state: any;

  constructor(state) {
    this.state = state;
  }

  transitionTo(state): State.PlayerAState {
    this.state = state;
    return state;
  }
  errorOccurred(message: string): State.PlayerAState {
    switch (this.state.constructor) {
      case State.WaitForApproval:
      case State.WaitForBlockchainDeploy:
        const newPosition: Error = { message };
        return this.transitionTo(new State.FundingFailed(newPosition));
      default:
        return this.state;
    }
  }

  approve(): State.PlayerAState {
    if (this.state.constructor === State.WaitForApproval) {
      return this.transitionTo(new State.ReadyToDeploy());
    } else {
      return this.state;
    }
  }

  transactionConfirmed(adjudicator: string): State.PlayerAState {
    if (
      this.state.constructor === State.WaitForBlockchainDeploy ||
      this.state.constructor === State.FundingFailed
    ) {
      const newPosition = new AdjudicatorReceived(adjudicator);
      return this.transitionTo(new State.WaitForBToDeposit(newPosition));
    } else {
      return this.state;
    }
  }

  transactionSent() {
    if (this.state.constructor === State.ReadyToDeploy) {
      return this.transitionTo(new State.WaitForBlockchainDeploy());
    } else {
      return this.state;
    }
  }

  receiveFundingEvent(): State.PlayerAState {
    if (this.state.constructor === State.WaitForBToDeposit) {
      return this.transitionTo(new State.Funded());
    } else {
      return this.state;
    }
  }
}
