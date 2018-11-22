import { ethers } from 'ethers';
import simpleAdjudicatorArtifact from '../../contracts/artifacts/SimpleAdjudicator.json';
import detectNetwork from 'web3-detect-network';

/*
As of November 2, 2018, metamask will introduce a breaking change where it will
no longer inject a connected web3 instance to the browser.

Instead, it will inject an ethereum provider, under the variable `ethereum`.
See: https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
*/

export async function getProvider(): Promise<ethers.providers.Web3Provider>{
  return await new ethers.providers.Web3Provider(web3.currentProvider);
}

export async function createFactory(): Promise<ethers.ContractFactory> {
  const provider = await getProvider();
  return new ethers.ContractFactory(simpleAdjudicatorArtifact.abi, await linkBytecode(simpleAdjudicatorArtifact), provider.getSigner());
}

async function linkBytecode(contractArtifact) {
  const network = await detectNetwork(web3.currentProvider);
  let contractBytecode = contractArtifact.bytecode;
  const links = contractArtifact.networks[network.id].links;
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