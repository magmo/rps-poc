import detectNetwork from 'web3-detect-network';
import contract from 'truffle-contract';
import BN from 'bn.js';
// @ts-ignore
import simpleAdjudicatorArtifact from 'fmg-simple-adjudicator/contracts/SimpleAdjudicator.sol';

import connectedWeb3 from '../wallet/web3';

export async function deploySimpleAdjudicator({ channelId, amount }: { channelId: string, amount: BN }) {
  const truffleContract = await setupContract();

  let contractBytecode;
  contractBytecode = truffleContract.bytecode;

  Object.keys(truffleContract.links).forEach(linkName => {
    const replace = `__${linkName}_________________________________`;
    contractBytecode = contractBytecode.replace(new RegExp(replace,"g"), truffleContract.links[linkName].substr(2));
  });

  const web3Contract = new connectedWeb3.eth.Contract(simpleAdjudicatorArtifact.abi, connectedWeb3.eth.defaultAccount);

  const tx = web3Contract.deploy({
    data: contractBytecode,
    arguments: [channelId],
  });

  const deployedContract = await tx.send({ from: connectedWeb3.eth.defaultAccount, value: amount.toString() });

  return await truffleContract.at(deployedContract.options.address);
}

export async function simpleAdjudicatorAt({ address, amount } : { address: string, amount: BN }) {
  const truffleContract = await setupContract();
  return await truffleContract.at(address, { value: amount.toString() });
}

async function setupContract() {
  const simpleAdjudicatorContract = contract(simpleAdjudicatorArtifact);
  simpleAdjudicatorContract.setProvider(connectedWeb3.currentProvider);

  const network = await detectNetwork(web3.currentProvider);
  simpleAdjudicatorContract.setNetwork(network.id);

  await simpleAdjudicatorContract.defaults({ from: connectedWeb3.eth.defaultAccount });
  return simpleAdjudicatorContract;
}