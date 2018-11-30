import { ethers } from "ethers";
import simpleAdjudicatorArtifact from '../../../build/contracts/SimpleAdjudicator.json';
import { Channel } from "fmg-core";
import { createForceMoveTransaction, createDeployTransaction } from "../domain/TransactionGenerator";
import { scenarios } from "../../core";
import { Signature } from "../domain/Signature";
import { transactionSender } from "../redux/sagas/transaction-sender";
import { transactionSentToMetamask, transactionSubmitted } from '../redux/actions';
import { put } from "redux-saga/effects";
jest.setTimeout(20000);

describe('transaction sending', () => {
  let networkId;
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

  // the following private key is funded with 1 million eth in the startGanache function
  const privateKey = '0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d';

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
  it.only('should deploy a contract', async () => {
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    const saga = transactionSender(deployTransaction);
    expect(saga.next()).toEqual(put(transactionSentToMetamask()));
    saga.next(provider);
    expect(saga.next()).toEqual(put(transactionSubmitted()));
    const signer = provider.getSigner();
    const transaction = await signer.sendTransaction(deployTransaction);
    console.log(saga.next(transaction));
    saga.next(transaction);

  });
  it('does stuff', async () => {

    // const sig = new Signature(scenarios.standard.acceptSig);
    // const transactionToSend = createForceMoveTransaction()
    // const saga = transactionSender(transactionToSend);
    // saga.next();
    // saga.next(provider);
    // saga.next();
    // const signer = provider.getSigner();
    // await signer.sendTransaction(transactionToSend).catch(err => console.log(err));
    // const transaction = await signer.sendTransaction(transactionToSend);

    // saga.next(transaction);
    // saga.next();
    // saga.next();

  });
});