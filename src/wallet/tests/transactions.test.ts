import BN from 'bn.js';
import { ethers } from "ethers";
import { Channel, sign } from "fmg-core";
import { put } from "redux-saga/effects";
import { getLibraryAddress } from "../../contracts/simpleAdjudicatorUtils";
import { encode, Move, positions } from "../../core";
import bnToHex from "../../utils/bnToHex";
import { randomHex } from "../../utils/randomHex";
import { Signature } from "../domain";
import { createDeployTransaction, createDepositTransaction, createForceMoveTransaction, createRespondWithMoveTransaction, createRefuteTransaction, createConcludeAndWithdrawTransaction, ConcludeAndWithdrawArgs, createConcludeTransaction, createWithdrawTransaction } from "../domain/TransactionGenerator";
import { transactionConfirmed, transactionFinalized, transactionSentToMetamask, transactionSubmitted } from '../redux/actions';
import { signPositionHex, signVerificationData } from "../redux/reducers/utils";
import { transactionSender } from "../redux/sagas/transaction-sender";

jest.setTimeout(20000);

describe('transactions', () => {
  let networkId;
  let libraryAddress;
  let nonce = 5;
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

  const fiveFive = [new BN(5), new BN(5)].map(bnToHex) as [string, string];
  const fourSix = [new BN(4), new BN(6)].map(bnToHex) as [string, string];
  const participantA = ethers.Wallet.createRandom();
  const participantB = ethers.Wallet.createRandom();
  const participants = [participantA.address, participantB.address] as [string, string];
  const baseMoveArgs = {
    salt: randomHex(64),
    asMove: Move.Rock,
    roundBuyIn: '0x1',
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
    balances: fourSix,
  };
  function getNextNonce() {
    return ++nonce;
  }
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
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionConfirmed(confirmedTransaction.contractAddress)));

    saga.next();
    expect(saga.next(confirmedTransaction).value).toEqual(put(transactionFinalized()));
    expect(saga.next().done).toBe(true);

  }

  async function deployContract(channelNonce) {
    const channel = new Channel(libraryAddress, channelNonce, participants);
    const signer = provider.getSigner();
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    const transactionReceipt = await signer.sendTransaction(deployTransaction);
    const confirmedTransaction = await transactionReceipt.wait();
    return confirmedTransaction.contractAddress as string;
  }

  async function depositContract(address) {
    const signer = provider.getSigner();
    const deployTransaction = createDepositTransaction(address, '0x5');
    const transactionReceipt = await signer.sendTransaction(deployTransaction);
    await transactionReceipt.wait();

  }

  async function createChallenge(address, channelNonce) {
    const signer = provider.getSigner();
    const fromPosition = encode(positions.proposeFromSalt({ libraryAddress, channelNonce, ...proposeArgs }));
    const toPosition = encode(positions.accept({ libraryAddress, channelNonce, ...acceptArgs }));
    const fromSig = new Signature(signPositionHex(fromPosition, participantB.privateKey));
    const toSig = new Signature(signPositionHex(toPosition, participantA.privateKey));
    const challengeTransaction = createForceMoveTransaction(address, fromPosition, toPosition, fromSig, toSig);
    const transactionReceipt = await signer.sendTransaction(challengeTransaction);
    await transactionReceipt.wait();
  }

  async function concludeGame(address, channelNonce) {
    const signer = provider.getSigner();
    const concludeArgs = {
      ...baseMoveArgs,
      balances: fiveFive,
      libraryAddress,
      channelNonce,

    };
    const fromState = encode(positions.conclude({ ...concludeArgs, turnNum: 50 }));
    const fromSignature = new Signature(signPositionHex(fromState, participantA.privateKey));
    const toState = encode(positions.conclude({ ...concludeArgs, turnNum: 51 }));
    const toSignature = new Signature(signPositionHex(toState, participantB.privateKey));

    const concludeTransaction = createConcludeTransaction(address, fromState, toState, fromSignature, toSignature);
    const transactionReceipt = await signer.sendTransaction(concludeTransaction);
    await transactionReceipt.wait();
  }

  beforeEach(async () => {
    const network = await provider.getNetwork();
    networkId = network.chainId;
    libraryAddress = getLibraryAddress(networkId);
  });


  it('should deploy the contract', async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
    await testTransactionSender(deployTransaction);

  });
  it('should deposit into the contract', async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const contractAddress = await deployContract(channel.channelNonce) as string;
    const depositTransaction = createDepositTransaction(contractAddress, '0x5');
    await testTransactionSender(depositTransaction);

  });
  it("should send a forceMove transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);
    const fromPosition = encode(positions.proposeFromSalt({ libraryAddress, channelNonce, ...proposeArgs }));
    const toPosition = encode(positions.accept({ libraryAddress, channelNonce, ...acceptArgs }));
    const fromSig = new Signature(signPositionHex(fromPosition, participantB.privateKey));
    const toSig = new Signature(signPositionHex(toPosition, participantA.privateKey));

    const forceMoveTransaction = createForceMoveTransaction(contractAddress, fromPosition, toPosition, fromSig, toSig);
    await testTransactionSender(forceMoveTransaction);

  });

  it("should send a respondWithMove transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);
    await createChallenge(contractAddress, channelNonce);
    const revealArgs = {
      turnNum: 7,
      balances: fourSix,
      salt: randomHex(64),
      asMove: Move.Rock,
      bsMove: Move.Paper,
      roundBuyIn: '0x1',
      libraryAddress,
      channelNonce,
      participants,
    };

    const toPosition = encode(positions.reveal(revealArgs));

    const toSig = new Signature(signPositionHex(toPosition, participantB.privateKey));

    const respondWithMoveTransaction = createRespondWithMoveTransaction(contractAddress, toPosition, toSig);
    await testTransactionSender(respondWithMoveTransaction);
  });

  it("should send a refute transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);
    await createChallenge(contractAddress, channelNonce);
    const secondProproseArgs = {
      ...baseMoveArgs,
      turnNum: 100,
      balances: fiveFive,
      channelNonce,
      libraryAddress,
    };

    const toPosition = encode(positions.proposeFromSalt(secondProproseArgs));
    const toSig = new Signature(signPositionHex(toPosition, participantA.privateKey));

    const refuteTransaction = createRefuteTransaction(contractAddress, toPosition, toSig);
    await testTransactionSender(refuteTransaction);
  });

  it("should send a conclude and withdraw transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);

    const concludeArgs = {
      ...baseMoveArgs,
      balances: fiveFive,
      libraryAddress,
      channelNonce,

    };
    const fromState = encode(positions.conclude({ ...concludeArgs, turnNum: 50 }));
    const fromSignature = new Signature(signPositionHex(fromState, participantA.privateKey));
    const toState = encode(positions.conclude({ ...concludeArgs, turnNum: 51 }));
    const toSignature = new Signature(signPositionHex(toState, participantB.privateKey));
    const verificationSignature = new Signature(signVerificationData(participantA.address, participantA.address, channel.id, participantA.privateKey));
    const concludeAndWithdrawArgs: ConcludeAndWithdrawArgs = {
      contractAddress,
      channelId: channel.id,
      fromState,
      toState,
      fromSignature,
      toSignature,
      participant: participantA.address,
      destination: participantA.address,
      verificationSignature,
    };
    const concludeAndWithdrawTransaction = createConcludeAndWithdrawTransaction(concludeAndWithdrawArgs);
    await testTransactionSender(concludeAndWithdrawTransaction);
  });

  it("should send a conclude transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);

    const concludeArgs = {
      ...baseMoveArgs,
      balances: fiveFive,
      libraryAddress,
      channelNonce,

    };
    const fromState = encode(positions.conclude({ ...concludeArgs, turnNum: 50 }));
    const fromSignature = new Signature(signPositionHex(fromState, participantA.privateKey));
    const toState = encode(positions.conclude({ ...concludeArgs, turnNum: 51 }));
    const toSignature = new Signature(signPositionHex(toState, participantB.privateKey));

    const concludeTransaction = createConcludeTransaction(contractAddress, fromState, toState, fromSignature, toSignature);
    await testTransactionSender(concludeTransaction);
  });

  it("should send a withdraw transaction", async () => {
    const channel = new Channel(libraryAddress, getNextNonce(), participants);
    const { channelNonce } = channel;
    const contractAddress = await deployContract(channelNonce) as string;
    await depositContract(contractAddress);
    await concludeGame(contractAddress, channelNonce);
    const verificationSignature = new Signature(signVerificationData(participantA.address, participantA.address, channel.id, participantA.privateKey));
    const withdrawTransaction = createWithdrawTransaction(contractAddress, participantA.address, participantA.address, channel.id, verificationSignature);
    await testTransactionSender(withdrawTransaction);
  });
});