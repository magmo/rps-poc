// // import { ethers } from 'ethers';

// import { Contract, Wallet, getDefaultProvider } from 'ethers';
// /*
// As of November 2, 2018, metamask will introduce a breaking change where it will
// no longer inject a connected web3 instance to the browser.

// Instead, it will inject an ethereum provider, under the variable `ethereum`.
// See: https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
// */
// const provider = getDefaultProvider('ropsten');
// // const wallet = new Wallet('foo', provider);
// const abi = [
//   "FundsReceived(uint amountReceived, address sender, uint adjudicatorBalance)",
//   "function forceMove(bytes _fromState, bytes _toState, uint8[] _v, bytes32[] _r, bytes32[] _s)"
// ];
// const contractAddress = '0x...';
// const contract = new Contract(contractAddress, abi, provider);
