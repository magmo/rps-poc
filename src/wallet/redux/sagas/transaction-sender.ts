import { call, put } from "redux-saga/effects";
import { getProvider } from "../../../contracts/simpleAdjudicatorUtils";
import { transactionInitiated, transactionSubmitted, transactionConfirmed, transactionFinalized } from "../actions";

export function* transactionSender(transaction) {

  const provider = yield call(getProvider);

  yield put(transactionInitiated());
  const transactionResult = yield call(provider.sendTransaction, transaction);
  yield put(transactionSubmitted());
  yield call(transactionResult.wait);
  yield put(transactionConfirmed());
  yield call(transactionResult.wait, 5);
  yield put(transactionFinalized());



}
