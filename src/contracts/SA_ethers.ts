import { ethers } from 'ethers';
import contract from 'truffle-contract';
import BN from 'bn.js';
import { delay } from 'redux-saga';
// @ts-ignore
import simpleAdjudicatorArtifact from 'fmg-simple-adjudicator/contracts/SimpleAdjudicator.sol';
import detectNetwork from 'web3-detect-network';

import { connectWeb3 } from 'src/wallet/web3';

/*
As of November 2, 2018, metamask will introduce a breaking change where it will
no longer inject a connected web3 instance to the browser.

Instead, it will inject an ethereum provider, under the variable `ethereum`.
See: https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
*/

export async function deployableFactory() {
  // const provider = ethers.getDefaultProvider('ropsten');
  const provider = await new ethers.providers.Web3Provider(web3.currentProvider);
  const { abi, contractBytecode } = await truffleAbiAndByteCode();

  return new ethers.ContractFactory(abi, contractBytecode, provider.getSigner());
}

async function truffleAbiAndByteCode() {
  const truffleContract = await setupContract(connectWeb3());
  const abi = truffleContract.abi;
  
  let contractBytecode;
  contractBytecode = truffleContract.bytecode;

  Object.keys(truffleContract.links).forEach(linkName => {
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
      truffleContract.links[linkName].substr(2)
    );
  });

  return { abi, contractBytecode };

}

async function verifyContractDeployed(address){
  // Check if we can access the code at the address if not delay and try again
  let code = await connectWeb3().eth.getCode(address);
  let delayAmount = 100;
  while ((code === '' || code === '0x') && delayAmount < 120000) {
    await delay(delayAmount);
    delayAmount *= 2;
    code = await connectWeb3().eth.getCode(address);
  }
  if (code === '' || code === '0x'){
    return false;
  }else{
    return true;
  }
}

export async function simpleAdjudicatorAt({ address, amount }: { address: string, amount: BN }) {
  await verifyContractDeployed(address);
  
  const truffleContract = await setupContract(address);
  return await truffleContract.at(address, { value: amount.toString() });
}

async function setupContract(connectedWeb3) {
  const simpleAdjudicatorContract = contract(simpleAdjudicatorArtifact);
  simpleAdjudicatorContract.setProvider(connectedWeb3.currentProvider);

  const network = await detectNetwork(web3.currentProvider);
  simpleAdjudicatorContract.setNetwork(network.id);

  await simpleAdjudicatorContract.defaults({ from: connectedWeb3.eth.defaultAccount });
  return simpleAdjudicatorContract;
}