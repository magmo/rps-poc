import { ethers } from "ethers";
import { Channel } from "fmg-core";
import { createDeployTransaction, createDepositTransaction } from "../domain/TransactionGenerator";

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
  async function deployContract() {
    const signer = provider.getSigner();
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    const transactionReceipt = await signer.sendTransaction(deployTransaction);
    const confirmedTransaction = await transactionReceipt.wait();
    return confirmedTransaction.contractAddress;
  }

  async function testTransactionSender(transactionToSend) {
    // TODO: We need to figure out a better way of testing the saga
    const saga = transactionSender(transactionToSend);
    saga.next();
    expect(saga.next(provider).value).toEqual(put(transactionSentToMetamask()));
    const signer = provider.getSigner();
    const transactionReceipt = await signer.sendTransaction(transactionToSend);
    saga.next();
    expect(saga.next(transactionReceipt).value).toEqual(put(transactionSubmitted()));
    const confirmedTransaction = await transactionReceipt.wait();
    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionConfirmed(confirmedTransaction.contractAddress)));
    // We don't actually bother waiting for 5 confirmations as that will make the test take too long
    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionFinalized()));
    expect(saga.next().done).toBe(true);

  }

  beforeEach(async () => {

    const network = await provider.getNetwork();
    networkId = network.chainId;

  });
  // Currently this test will only work when ganache is running and the contracts are deployed
  // Need to update the scripts to do this so it passes on the CI server => {
  it.skip('should deploy the contract', async () => {
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    await testTransactionSender(deployTransaction);
  });
  it.skip('should deposit into the contract', async () => {
    const contractAddress = await deployContract() as string;
    const depositTransaction = createDepositTransaction(contractAddress, '0x5');
    await testTransactionSender(depositTransaction);
  });
});