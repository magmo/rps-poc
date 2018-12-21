import { select, cancel, take, fork, actionChannel } from 'redux-saga/effects';

import { keyLoader } from './key-loader';
import { messageListener } from './message-listener';
import { messageSender } from './message-sender';
import { transactionSender } from './transaction-sender';
import { adjudicatorWatcher } from './adjudicator-watcher';

import { SiteState } from '../../../redux/reducer';
import { WalletState, WAIT_FOR_ADDRESS } from '../../states';
import { getProvider } from '../../utils/contract-utils';

export function* sagaManager(): IterableIterator<any> {
  let adjudicatorWatcherProcess;

  // always want the message listenter to be running
  yield fork(messageListener);

  yield fork(messageSender);

  // todo: restrict just to wallet actions
  const channel = yield actionChannel('*');

  while (true) {
    yield take(channel);

    const state: WalletState = yield select((siteState: SiteState) => siteState.wallet);

    // if we don't have an address, make sure that the keyLoader runs once
    // todo: can we be sure that this won't be called more than once if successful?
    if (state.type === WAIT_FOR_ADDRESS) {
      yield keyLoader();
    }

    // if have adjudicator, make sure that the adjudicator watcher is running
    if ('adjudicator' in state && state.adjudicator) {
      if (!adjudicatorWatcherProcess) {
        const provider = yield getProvider();
        adjudicatorWatcherProcess = yield fork(adjudicatorWatcher, state.adjudicator, provider);
      }
    } else {
      if (adjudicatorWatcherProcess) {
        yield cancel(adjudicatorWatcherProcess);
        adjudicatorWatcherProcess = undefined;
      }
    }

    // if we have an outgoing transaction, make sure that the transaction-sender runs
    if (state.transactionOutbox) {
      const transactionToSend = state.transactionOutbox;
      state.transactionOutbox = undefined;
      yield transactionSender(transactionToSend);

    }
  }
}

