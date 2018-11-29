import { Wallet } from "ethers";
import { select, call, put } from "redux-saga/effects";
import { getProvider } from "../../../contracts/simpleAdjudicatorUtils";
import { transactionInitiated, transactionSubmitted, transactionConfirmed, transactionFinalized } from "../actions";

export function* transactionSender(transaction) {
  const getPrivateKey = (storeObj: any) => storeObj.wallet.privateKey;
  const privateKey: string = yield select(getPrivateKey);
  const provider = yield call(getProvider);
  const wallet = new Wallet(privateKey, provider);

  yield put(transactionInitiated());
  const transactionResult = yield call(wallet.sendTransaction, transaction);
  yield put(transactionSubmitted());
  yield call(transactionResult.wait);
  yield put(transactionConfirmed());
  yield call(transactionResult.wait(5));
  yield put(transactionFinalized());



}
