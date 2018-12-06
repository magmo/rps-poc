import { getAdjudicatorContract } from "../../utils/contract-utils";
import { call, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from "../actions";
import { ethers } from "ethers";

enum AdjudicatorEventType {
  FundsReceived,
  ChallengeCreated,
  GameConcluded,
  Refuted,
}

interface AdjudicatorEvent {
  eventArgs: any;
  eventType: AdjudicatorEventType;
}

function* createEventChannel(adjudicatorAddress: string, provider)){
  const simpleAdjudicator: ethers.Contract = yield call(getAdjudicatorContract, adjudicatorAddress, provider);

  return eventChannel((emitter) => {
    const fundReceivedFilter = simpleAdjudicator.filters.FundsReceived();
    const challengeCreatedFilter = simpleAdjudicator.filters.ChallengeCreated();
    const gameConcludedFilter = simpleAdjudicator.filters.GameConcluded();
    const refutedFilter = simpleAdjudicator.filters.Refuted();

    simpleAdjudicator.on(fundReceivedFilter, (amountReceived, sender, adjudicatorBalance) => {
      emitter({ eventType: AdjudicatorEventType.FundsReceived, eventArgs: { amountReceived, sender, adjudicatorBalance } });
    });
    simpleAdjudicator.on(challengeCreatedFilter, (channelId, state, expirationTime, payouts) => {
      emitter({ eventType: AdjudicatorEventType.ChallengeCreated, eventArgs: { channelId, state, expirationTime, payouts } });
    });
    simpleAdjudicator.on(gameConcludedFilter, () => {
      emitter({ eventType: AdjudicatorEventType.GameConcluded, eventArgs: null });
    });
    simpleAdjudicator.on(refutedFilter,(refuteState)=>{
      emitter({eventType: AdjudicatorEventType.Refuted, eventArgs:{refuteState}});
    });
    return () => {
      // This function is called when the channel gets closed
      simpleAdjudicator.removeAllListeners(fundReceivedFilter);
      simpleAdjudicator.removeAllListeners(challengeCreatedFilter);
      simpleAdjudicator.removeAllListeners(gameConcludedFilter);
      simpleAdjudicator.removeAllListeners(refutedFilter);
    };
  });
}
export function* adjudicatorWatcher(adjudicatorAddress: string, provider) {
 
  const channel = yield call(createEventChannel,adjudicatorAddress,provider);
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
      case AdjudicatorEventType.GameConcluded:
        yield put(actions.gameConcludedEvent());
        break;
      case AdjudicatorEventType.Refuted:
        yield put(actions.refutedEvent(event.eventArgs.refuteState));
        break;

    }

  }

}
