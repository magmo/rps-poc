import * as blockchainActions from '../actions/blockchain';
import { take, put, actionChannel } from 'redux-saga/effects';
// @ts-ignore
import simpleAdjudicatorArtifact from 'fmg-simple-adjudicator/contracts/SimpleAdjudicator.sol';
import contract from 'truffle-contract';
import detectNetwork from 'web3-detect-network';
// The blockchain saga will be responsible for dealing with the blockchain using truffle
export function* blockchainSaga() {
  const channel = yield actionChannel(blockchainActions.BLOCKCHAIN_DEPLOYADJUDICATOR);
  while (true) {
    const action = yield take(channel);
    switch (action.type) {
      case blockchainActions.BLOCKCHAIN_DEPLOYADJUDICATOR:
        const simpleAdjudicatorContract = contract(simpleAdjudicatorArtifact);

        const network = yield detectNetwork(web3.currentProvider);
        if (!Object.keys(simpleAdjudicatorContract.networks).find(id => id === network.id)) {
          yield put(blockchainActions.wrongNetwork(network.id));
          break;
        }
        simpleAdjudicatorContract.setProvider(web3.currentProvider);
        simpleAdjudicatorContract.setNetwork(network.id);
        try {
          const deployedContract = yield simpleAdjudicatorContract.new([action.channelId], {
            from: web3.eth.defaultAccount,
          });
          yield put(blockchainActions.adjudicatorDeployed(deployedContract.address));
        } catch (err) {
          yield put(blockchainActions.metamaskError(err));
        }
        break;
    }
  }
}
