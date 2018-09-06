
import WalletEngineA from '../WalletEngineA';
import * as WalletStatesA from '../wallet-states/PlayerA';
import * as WalletStatesB from '../wallet-states/PlayerB';
import WalletEngineB from '../WalletEngineB';

describe('Happy path runthrough', () => {

  const transactionA = 'transactionA';
  const transactionB = 'transactionA';
  const adjudicator = 'adjudicator';
  // In A's application
  const walletEngineA = WalletEngineA.setupWalletEngine();
  const readyToDeploy = walletEngineA.state;
  it('should have the ready to deploy state', () => {
    expect(readyToDeploy).toBeInstanceOf(WalletStatesA.ReadyToDeploy);
    expect(readyToDeploy.transaction).toEqual(transactionA);
  });

  // In B's application
  const walletEngineB = WalletEngineB.setupWalletEngine();

  it('should have the wait for A to deploy state', () => {
    const waitForAToDeploy = walletEngineB.state;
    expect(waitForAToDeploy).toBeInstanceOf(WalletStatesB.WaitForAToDeploy);
    expect(waitForAToDeploy.transaction).toEqual(transactionB);
  });

  // In A's application
  it('should have the wait for blockchain to deploy state', () => {
    const waitForBlockchainToDeploy = walletEngineA.transactionSent();
    expect(waitForBlockchainToDeploy).toBeInstanceOf(WalletStatesA.WaitForBlockchainDeploy);
  });


  // In B's application

  it('should have the wait for blockchain deploy state', () => {
    const waitForBlockchainDeposit = walletEngineB.transactionSent();
    expect(waitForBlockchainDeposit).toBeInstanceOf(WalletStatesB.WaitForBlockchainDeposit);
    expect(waitForBlockchainDeposit.adjudicator).toEqual(adjudicator);
  });




});
