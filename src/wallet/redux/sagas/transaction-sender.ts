import { call, put } from "redux-saga/effects";
import { getProvider } from "../../../contracts/simpleAdjudicatorUtils";
import { transactionInitiated, transactionSubmitted, transactionConfirmed, transactionFinalized } from "../actions";
import { ethers } from "ethers";

export function* transactionSender(transaction) {

  const provider: ethers.providers.JsonRpcProvider = yield call(getProvider);
  const signer = provider.getSigner();
  yield put(transactionInitiated());
  const transactionResult = yield call(signer.sendTransaction, transaction);
  console.log(transactionResult);
  yield put(transactionSubmitted());
  yield call(transactionResult.wait);
  yield put(transactionConfirmed());
  yield call(transactionResult.wait, 5);
  yield put(transactionFinalized());



}
