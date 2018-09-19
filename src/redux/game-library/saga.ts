import { take, call, put } from "redux-saga/effects";
import * as actions from './actions';
import detectNetwork from 'web3-detect-network';
import contract from 'truffle-contract';
// @ts-ignore
import gameLibraryArtifacts from './../../../contracts/RockPaperScissorsGame.sol';

export default function* gameLibrarySaga() {
    yield take(actions.GAMELIBRARY_FETCH_REQUEST);

    const network = yield call(detectNetwork, web3.currentProvider);
    const rpsContract = contract(gameLibraryArtifacts);
    yield call(rpsContract.defaults, { from: web3.eth.defaultAccount });
    rpsContract.setProvider(web3.currentProvider);
    rpsContract.setNetwork(network.id);

    yield put(actions.fetchGameLibrarySuccess(rpsContract.address));


}