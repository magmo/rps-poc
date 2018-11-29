import { ethers } from "ethers";
import simpleAdjudicatorArtifact from '../../../build/contracts/SimpleAdjudicator.json';
import { Channel } from "fmg-core";
import { createForceMoveTransaction } from "../domain/TransactionGenerator";
import { scenarios } from "../../core";
import { Signature } from "../domain/Signature";
import { transactionSender } from "../redux/sagas/transaction-sender";
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
  let deployedContract;

  beforeEach(async () => {
    networkId = (await provider.getNetwork()).chainId;
    function linkedByteCode() {
      let contractBytecode = simpleAdjudicatorArtifact.bytecode;
      const links = simpleAdjudicatorArtifact.networks[networkId].links;
      Object.keys(links).forEach(linkName => {
        const replace = `__${linkName}_________________________________`;
        contractBytecode = contractBytecode.replace(
          new RegExp(replace, "g"),
          links[linkName].substr(2)
        );
      });
      return contractBytecode;
    }
    const factory = new ethers.ContractFactory(simpleAdjudicatorArtifact.abi, await linkedByteCode(), provider.getSigner());
    const deployTransaction = await factory.deploy(channel.id, 2, { value: 1 });
    // wait for the contract deployment transaction to be mined
    deployedContract = await deployTransaction.deployed();
  });

  it.only('does stuff', async () => {
    const sig = new Signature(scenarios.standard.acceptSig);
    const transactionToSend = { to: deployedContract.address, value: 1 };
    const saga = transactionSender(transactionToSend);
    saga.next();
    saga.next(provider);
    saga.next();
    const signer = provider.getSigner();
    await signer.sendTransaction(transactionToSend).catch(err => console.log(err));
    const transaction = await signer.sendTransaction(transactionToSend);

    saga.next(transaction);
    saga.next();
    saga.next();

  });
});