import { take, put, call } from "redux-saga/effects";
import * as actions from '../actions/validate';
import runMethod from "../../domain/eth-vm-validator";
import { ValidateRequest } from "../actions/validate";
// @ts-ignore
import gameLibraryArtifacts from 'fmg-core/contracts/ForceMoveGame.sol';
import Web3 from 'web3';


export default function* validateTransitionSaga(gameLibraryAddress: string) {
    const anotherWeb3 = new Web3('');
    anotherWeb3.setProvider(web3.currentProvider);
    const code = yield call(anotherWeb3.eth.getCode, gameLibraryAddress);
    while (true) {
        const action: ValidateRequest = yield take(actions.VALIDATE_REQUEST);
        const result = yield call(runMethod, { byteCode: code, interface: gameLibraryArtifacts.interface }, 'validTransition', [action.fromState.toHex(), action.toState.toHex()]);
        if (result) {
            yield put(actions.validateSuccess());
        }
    }
}