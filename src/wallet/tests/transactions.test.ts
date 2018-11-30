import { ethers } from "ethers";
import { Channel } from "fmg-core";
import { createDeployTransaction } from "../domain/TransactionGenerator";

import { transactionSender } from "../redux/sagas/transaction-sender";
import { transactionSentToMetamask, transactionSubmitted, transactionConfirmed, transactionFinalized } from '../redux/actions';
import { put } from "redux-saga/effects";
jest.setTimeout(20000);

describe('transactions', () => {
  let networkId;
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const gameLibrary = '0x0000000000000000000000000000000000000111';
  const channelNonce = 15;
  const participantA = ethers.Wallet.createRandom();
  const participantB = ethers.Wallet.createRandom();
  const participants = [participantA.address, participantB.address];
  const channel = new Channel(gameLibrary, channelNonce, participants);

  beforeEach(async () => {

    const network = await provider.getNetwork();
    networkId = network.chainId;

  });

  // Currently this test will only work when ganache is running and the contracts are deployed
  // Need to update the scripts to do this so it passes on the CI server
  it.skip('should deploy a contract', async () => {
    // TODO: We need to figure out a better way of testing the saga
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    const saga = transactionSender(deployTransaction);
    saga.next();
    expect(saga.next(provider).value).toEqual(put(transactionSentToMetamask()));
    const signer = provider.getSigner();
    const transaction = await signer.sendTransaction(deployTransaction);
    saga.next();
    expect(saga.next(transaction).value).toEqual(put(transactionSubmitted()));
    const confirmedTransaction = await transaction.wait();
    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionConfirmed(confirmedTransaction.contractAddress)));
    // We don't actually bother waiting for 5 confirmations as that will make the test take too long
    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionFinalized()));
    expect(saga.next().done).toBe(true);

  });
});