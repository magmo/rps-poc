import { call, put } from "redux-saga/effects";
import { transactionSentToMetamask, transactionSubmitted, transactionConfirmed, transactionFinalized, transactionSubmissionFailed } from "../actions";
import { ethers } from "ethers";
import { getProvider } from "src/wallet/utils/contract-utils";

export function* transactionSender(transaction) {

  const provider: ethers.providers.JsonRpcProvider = yield call(getProvider);
  const signer = provider.getSigner();
  yield put(transactionSentToMetamask());
  let transactionResult;
  try {
    transactionResult = yield call(signer.sendTransaction, transaction);
  } catch (err) {
    yield put(transactionSubmissionFailed(err));
    return;
  }
  yield put(transactionSubmitted());
  const confirmedTransaction = yield call(transactionResult.wait);
  yield put(transactionConfirmed(confirmedTransaction.contractAddress));
  yield call(transactionResult.wait, 5);
  yield put(transactionFinalized());



}
