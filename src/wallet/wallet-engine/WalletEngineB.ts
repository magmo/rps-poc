import { Wallet } from '..';
import * as State from './wallet-states/PlayerB';
export default class WalletEngineB {
  static setupWalletEngine(wallet: Wallet): WalletEngineB {
    const transaction = 'bla';
    const walletState = new State.WaitForAToDeploy({ transaction });
    return new WalletEngineB(wallet, walletState);
  }
  wallet: Wallet;
  state: any;

  constructor(wallet, state) {
    this.wallet = wallet;
    this.state = state;
  }

  receiveEvent(event): State.PlayerBState {
    switch (this.state.constructor) {
      case State.WaitForAToDeploy:
        return this.transitionTo(new State.ReadyToDeposit({ transaction: 'test' }));
      case State.WaitForBlockchainDeposit:
        const { adjudicator } = event;
        return this.transitionTo(new State.Funded({ adjudicator }));
      default:
        return this.state;
    }
  }

  transactionSent() {
    if (this.state.constructor === State.ReadyToDeposit) {
      return this.transitionTo(new State.WaitForBlockchainDeposit());
    }else{
        return this.state;
    }
  }
  
  transitionTo(state): State.PlayerBState {
    this.state = state;
    return state;
  }
}
