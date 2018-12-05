import { getAdjudicatorContract } from "../../utils/ContractUtils";
import { call } from 'redux-saga/effects';

export function* adjudicatorWatcher(adjudicatorAddress: string) {
  console.log('forst');
  // const simpleAdjudicator = yield call(getAdjudicatorContract, adjudicatorAddress);
  // console.log(simpleAdjudicator);
  // const fundReceivedFilter = simpleAdjudicator.FundsReceived();
  // simpleAdjudicator.on(fundReceivedFilter, (something) => {
  //   console.log(something);

  // });


}
