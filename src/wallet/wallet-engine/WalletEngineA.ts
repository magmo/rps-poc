import * as State from './wallet-states/PlayerA';

export default class WalletEngineA {
  static setupWalletEngine(): WalletEngineA {
    const walletState = new State.WaitForApproval();
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

  approve(): State.PlayerAState {
    if (this.state.constructor === State.WaitForApproval) {
      return this.transitionTo(new State.ReadyToDeploy());
    } else {
      return this.state;
    }
  }
  transactionConfirmed(adjudicator:string): State.PlayerAState {
    if (this.state.constructor === State.WaitForBlockchainDeploy){
      return this.transitionTo(new State.WaitForBToDeposit(adjudicator));
    }else{
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

  receiveEvent(event): State.PlayerAState {
    switch (this.state.constructor) {
      case State.WaitForBlockchainDeploy:
        const { adjudicator } = event;
        return this.transitionTo(new State.WaitForBToDeposit( adjudicator ));
      case State.WaitForBToDeposit:
        const stateAdjudicator = this.state.adjudicator;
        return this.transitionTo(new State.Funded({ adjudicator: stateAdjudicator }));
      default:
        return this.state;
    }
  }
}
