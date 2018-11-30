import { ethers, utils } from 'ethers';
import simpleAdjudicatorArtifact from '../../build/contracts/SimpleAdjudicator.json';
import BN from 'bn.js';

export async function depositFunds(address: string, amount: BN) {
  const depositTransaction = {
    to: address,
    value: utils.bigNumberify(amount.toString()),
  };
  const provider = await getProvider();
  const signer = provider.getSigner();

  return await signer.sendTransaction(depositTransaction);
}

export async function getProvider(): Promise<ethers.providers.Web3Provider> {
  return await new ethers.providers.Web3Provider(web3.currentProvider);
}


export function getSimpleAdjudicatorInterface(): ethers.utils.Interface {
  return new ethers.utils.Interface(simpleAdjudicatorArtifact.abi);
}

export function getSimpleAdjudicatorBytecode(networkId) {
  console.log(networkId);
  return linkBytecode(simpleAdjudicatorArtifact, networkId);
}

function linkBytecode(contractArtifact, networkId) {
  console.log(contractArtifact.networks);
  let contractBytecode = contractArtifact.bytecode;
  const links = contractArtifact.networks[networkId].links;
  Object.keys(links).forEach(linkName => {
    /*
      `truffle compile` creates bytecode that is not a hex string.
      Instead, the contract itself produces a valid hex string, followed
      by `__${linkName}_________________________________${moreByteCode}`

      We need to replace this stand-in with the address of the deployed
      linked library.
    */
    const replace = `__${linkName}_________________________________`;
    contractBytecode = contractBytecode.replace(
      new RegExp(replace, "g"),
      links[linkName].substr(2)
    );
  });
  return contractBytecode;
}