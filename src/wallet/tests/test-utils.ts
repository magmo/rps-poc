import { ethers } from 'ethers';
import { getLibraryAddress } from '../utils/contract-utils';
import { Channel } from 'fmg-core';
import { createDeployTransaction, createDepositTransaction, createForceMoveTransaction, createConcludeTransaction } from '../utils/transaction-generator';
import { positions, Move, encode } from '../../core';
import { Signature } from '../domain';
import { signPositionHex } from '../utils/signing-utils';
import { randomHex } from '../../utils/randomHex';
import BN from 'bn.js';
import bnToHex from '../../utils/bnToHex';

export const fiveFive = [new BN(5), new BN(5)].map(bnToHex) as [string, string];
export const fourSix = [new BN(4), new BN(6)].map(bnToHex) as [string, string];

export async function deployContract(channelNonce, participants: ethers.Wallet[]) {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner();
  const network = await provider.getNetwork();
  const networkId = network.chainId;
  const libraryAddress = getLibraryAddress(networkId);
  const channel = new Channel(libraryAddress, channelNonce, [participants[0].address, participants[1].address]);
  const deployTransaction = createDeployTransaction(networkId, channel.id, '0x5');
  const transactionReceipt = await signer.sendTransaction(deployTransaction);
  const confirmedTransaction = await transactionReceipt.wait();
  return confirmedTransaction.contractAddress as string;
}

export async function depositContract(address) {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner();
  const deployTransaction = createDepositTransaction(address, '0x5');
  const transactionReceipt = await signer.sendTransaction(deployTransaction);
  await transactionReceipt.wait();

}

export async function createChallenge(address, channelNonce, participants: ethers.Wallet[]) {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner();
  const network = await provider.getNetwork();
  const networkId = network.chainId;
  const libraryAddress = getLibraryAddress(networkId);
  const baseMoveArgs = {
    salt: randomHex(64),
    asMove: Move.Rock,
    roundBuyIn: '0x1',
    participants: [participants[0].address, participants[1].address] as [string, string],
  };

  const proposeArgs = {
    ...baseMoveArgs,
    turnNum: 5,
    balances: fiveFive,
    libraryAddress,
    channelNonce,
  };

  const acceptArgs = {
    ...baseMoveArgs,
    preCommit: positions.hashCommitment(baseMoveArgs.asMove, baseMoveArgs.salt),
    bsMove: Move.Paper,
    turnNum: 6,
    balances: fourSix,
    libraryAddress,
    channelNonce,
  };

  const fromPosition = encode(positions.proposeFromSalt(proposeArgs));
  const toPosition = encode(positions.accept(acceptArgs));
  const fromSig = new Signature(signPositionHex(fromPosition, participants[1].privateKey));
  const toSig = new Signature(signPositionHex(toPosition, participants[0].privateKey));
  const challengeTransaction = createForceMoveTransaction(address, fromPosition, toPosition, fromSig, toSig);
  const transactionReceipt = await signer.sendTransaction(challengeTransaction);
  await transactionReceipt.wait();
}

export async function concludeGame(address, channelNonce, participants: ethers.Wallet[]) {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = provider.getSigner();
  const network = await provider.getNetwork();
  const networkId = network.chainId;
  const libraryAddress = getLibraryAddress(networkId);

  const concludeArgs = {
    salt: randomHex(64),
    asMove: Move.Rock,
    roundBuyIn: '0x1',
    participants: [participants[0].address, participants[1].address] as [string, string],
    balances: fiveFive,
    libraryAddress,
    channelNonce,

  };
  const fromState = encode(positions.conclude({ ...concludeArgs, turnNum: 50 }));
  const fromSignature = new Signature(signPositionHex(fromState, participants[0].privateKey));
  const toState = encode(positions.conclude({ ...concludeArgs, turnNum: 51 }));
  const toSignature = new Signature(signPositionHex(toState, participants[1].privateKey));

  const concludeTransaction = createConcludeTransaction(address, fromState, toState, fromSignature, toSignature);
  const transactionReceipt = await signer.sendTransaction(concludeTransaction);
  await transactionReceipt.wait();
}