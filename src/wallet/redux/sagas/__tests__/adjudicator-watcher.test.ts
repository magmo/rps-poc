import { adjudicatorWatcher } from "../adjudicator-watcher";

import { scenarios } from "../../../../core";
import { createDepositTransaction, createDeployTransaction } from "../../../domain/TransactionGenerator";
import { ethers } from "ethers";
import { Channel } from "fmg-core";

describe('adjudicator listener', () => {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

  async function deployContract(channelNonce, libraryAddress) {
    const channel = new Channel(libraryAddress, channelNonce, scenarios.standard.participants);
    const signer = provider.getSigner();
    const networkId = (await provider.getNetwork()).chainId;
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
  it("should handle a funding event", async () => {
    const contractAddress = await deployContract(1, scenarios.standard.participants);
    const saga = adjudicatorWatcher(contractAddress);
    await depositContract('0x5');
    saga.next();
  });
});