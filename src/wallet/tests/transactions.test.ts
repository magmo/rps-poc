import { ethers } from "ethers";
import { Channel, sign as coreSign } from "fmg-core";
import { createDeployTransaction, createDepositTransaction, createForceMoveTransaction } from "../domain/TransactionGenerator";

import { transactionSender } from "../redux/sagas/transaction-sender";
import { transactionSentToMetamask, transactionSubmitted, transactionConfirmed, transactionFinalized } from '../redux/actions';
import { put } from "redux-saga/effects";
import { positions, Move, encode } from "../../core";
import { randomHex } from "../../utils/randomHex";
import { getLibraryAddress } from "../../contracts/simpleAdjudicatorUtils";
import BN from 'bn.js';
import bnToHex from "../../utils/bnToHex";
import { Signature } from "../domain";
import { signPositionHex } from "../redux/reducers/utils";

jest.setTimeout(20000);

describe('transactions', () => {
  let networkId;
  let gameLibrary;
  let channel;
  let contractAddress;
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

  const fiveFive = [new BN(5), new BN(5)].map(bnToHex) as [string, string];
  const sixFour = [new BN(6), new BN(4)].map(bnToHex) as [string, string];
  const channelNonce = 15;
  const participantA = ethers.Wallet.createRandom();
  const participantB = ethers.Wallet.createRandom();
  const participants = [participantA.address, participantB.address] as [string, string];

  async function testTransactionSender(transactionToSend) {

    const saga = transactionSender(transactionToSend);
    saga.next();
    expect(saga.next(provider).value).toEqual(put(transactionSentToMetamask()));
    const signer = provider.getSigner();
    const transactionReceipt = await signer.sendTransaction(transactionToSend);
    saga.next();
    expect(saga.next(transactionReceipt).value).toEqual(put(transactionSubmitted()));
    const confirmedTransaction = await transactionReceipt.wait();
    saga.next();
    contractAddress = confirmedTransaction.contractAddress;
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionConfirmed(confirmedTransaction.contractAddress)));
    // We don't actually bother waiting for 5 confirmations as that will make the test take too long
    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionFinalized()));
    expect(saga.next().done).toBe(true);

  }

  beforeEach(async () => {
    const network = await provider.getNetwork();
    networkId = network.chainId;
    gameLibrary = getLibraryAddress(networkId);
    channel = new Channel(gameLibrary, channelNonce, participants);

  });


  it('should deploy the contract', async () => {
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    await testTransactionSender(deployTransaction);
  });
  it('should deposit into the contract', async () => {
    const depositTransaction = createDepositTransaction(contractAddress, '0x5');
    await testTransactionSender(depositTransaction);
  });
  it("should send a forceMove transaction", async () => {
    const baseMoveArgs = {
      salt: randomHex(64),
      asMove: Move.Paper,
      roundBuyIn: '0x1',
      libraryAddress: gameLibrary,
      channelNonce,
      participants,
    };
    const proposeArgs = {
      ...baseMoveArgs,
      turnNum: 5,
      balances: fiveFive,
    };

    const acceptArgs = {
      ...baseMoveArgs,
      preCommit: positions.hashCommitment(baseMoveArgs.asMove, baseMoveArgs.salt),
      bsMove: Move.Paper,
      turnNum: 6,
      balances: sixFour,
    };
    const fromPosition = encode(positions.proposeFromSalt(proposeArgs));
    const toPosition = encode(positions.accept(acceptArgs));

    const fromSig = new Signature(signPositionHex(fromPosition, participantA.privateKey));
    const toSig = new Signature(signPositionHex(toPosition, participantB.privateKey));

    const forceMoveTransaction = createForceMoveTransaction(contractAddress, fromPosition, toPosition, fromSig, toSig);
    testTransactionSender(forceMoveTransaction);
  });

});