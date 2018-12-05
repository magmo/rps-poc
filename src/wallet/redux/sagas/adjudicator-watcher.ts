import { getAdjudicatorContract } from "../../utils/contract-utils";
import { call, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from "../actions";
import { ethers } from "ethers";

enum AdjudicatorEventType {
  FundsReceived,
  ChallengeCreated,
}

interface AdjudicatorEvent {
  eventArgs: any;
  eventType: AdjudicatorEventType;
}

export function* adjudicatorWatcher(adjudicatorAddress: string, provider) {
  const simpleAdjudicator: ethers.Contract = yield call(getAdjudicatorContract, adjudicatorAddress, provider);

  const channel = eventChannel((emitter) => {
    const fundReceivedFilter = simpleAdjudicator.filters.FundsReceived();
    const challengeCreatedEvent = simpleAdjudicator.filters.ChallengeCreated();
    simpleAdjudicator.on(fundReceivedFilter, (amountReceived, sender, adjudicatorBalance) => {
      emitter({ eventType: AdjudicatorEventType.FundsReceived, eventArgs: { amountReceived, sender, adjudicatorBalance } });
    });
    simpleAdjudicator.on(challengeCreatedEvent, (channelId, state, expirationTime, payouts) => {
      emitter({ eventType: AdjudicatorEventType.ChallengeCreated, eventArgs: { channelId, state, expirationTime, payouts } });
    });
    return () => { /* bleg */ };
  });


  while (true) {
    const event: AdjudicatorEvent = yield take(channel);
    switch (event.eventType) {
      case AdjudicatorEventType.FundsReceived:
        const { amountReceived, sender, adjudicatorBalance } = event.eventArgs;
        yield put(actions.fundingReceivedEvent(amountReceived.toHexString(), sender, adjudicatorBalance.toHexString()));
        break;
      case AdjudicatorEventType.ChallengeCreated:
        const { channelId, state, expirationTime, } = event.eventArgs;
        const payouts = event.eventArgs.payouts.map(bn => bn.toHexString());
        yield put(actions.challengeCreatedEvent(channelId, state, expirationTime, payouts));
        break;

    }

  }

}
