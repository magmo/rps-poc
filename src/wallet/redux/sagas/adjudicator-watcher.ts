import { getAdjudicatorContract } from "../../utils/contract-utils";
import { call, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from "../actions";
import { ethers } from "ethers";

enum AdjudicatorEventType {
  FundsReceived,
}

interface AdjudicatorEvent {
  eventArgs: any;
  eventType: AdjudicatorEventType;
}

export function* adjudicatorWatcher(adjudicatorAddress: string, provider) {
  const simpleAdjudicator: ethers.Contract = yield call(getAdjudicatorContract, adjudicatorAddress, provider);

  const channel = eventChannel((emitter) => {
    const fundReceivedFilter = simpleAdjudicator.filters.FundsReceived();
    simpleAdjudicator.on(fundReceivedFilter, (amountReceived, sender, adjudicatorBalance) => {
      emitter({ eventType: AdjudicatorEventType.FundsReceived, eventArgs: { amountReceived, sender, adjudicatorBalance } });
    });
    return () => { /* bleg */ };
  });

  console.log(channel);
  while (true) {
    console.log('asda');
    const event: AdjudicatorEvent = yield take(channel);
    console.log(event);
    const { amountReceived, sender, adjudicatorBalance } = event.eventArgs;
    yield put(actions.fundingReceivedEvent(amountReceived, sender, adjudicatorBalance));
  }

}
