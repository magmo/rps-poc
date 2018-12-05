import { getAdjudicatorContract } from "../../../contracts/simpleAdjudicatorUtils";
import { call, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actions } from "../../";
import { ethers } from "ethers";


export function* adjudicatorWatcher(adjudicatorAddress: string, provider) {
  const simpleAdjudicator: ethers.Contract = yield call(getAdjudicatorContract, adjudicatorAddress, provider);

  const channel = eventChannel((emitter) => {
    const fundReceivedFilter = simpleAdjudicator.filters.FundsReceived();
    simpleAdjudicator.on(fundReceivedFilter, (something) => {
      emitter(something);
    });
    return () => { /* bleg */ };
  });

  console.log(channel);
  while (true) {
    console.log('asda');
    const something = yield take(channel);
    console.log(something);
    yield put(actions.fundingSuccess(something));
  }

}
