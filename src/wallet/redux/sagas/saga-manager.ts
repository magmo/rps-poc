import { select, cancel, take, fork, actionChannel } from 'redux-saga/effects';

import { keyLoader } from './key-loader';
import { messageListener } from './message-listener';
import { messageSender } from './message-sender';
import { transactionSender } from './transaction-sender';

import { SiteState } from '../../../redux/reducer';
import { WalletState } from '../../states';

export function* sagaManager(): IterableIterator<any> {
  let adjudicatorWatcherProcess;

  // always want the message listenter to be running
  yield fork(messageListener);

  // todo: restrict just to wallet actions
  const channel = yield actionChannel('*');

  while (true) {
    yield take(channel);

    const state: WalletState = yield select((siteState: SiteState) => siteState.wallet);

    // if we don't have an address, make sure that the keyLoader runs once
    // todo: can we be sure that this won't be called more than once if successful?
    if (!('address' in state)) {
      yield keyLoader();
    }

    // if have adjudicator, make sure that the adjudicator watcher is running
    if ('adjudicator' in state) {
      if (!adjudicatorWatcherProcess) {
        // adjudicatorWatcherProcess = yield fork(adjudicatorWatcher);
      }
    } else {
      if (adjudicatorWatcherProcess) {
        yield cancel(adjudicatorWatcherProcess);
        adjudicatorWatcherProcess = undefined;
      }
    }

    // if we have an outgoing message, make sure that the message-sender runs
    if (state.messageOutbox) {
      yield messageSender(state.messageOutbox);
    }

    // if we have an outgoing transaction, make sure that the transaction-sender runs
    if (state.transactionOutbox) {
      yield transactionSender(state.transactionOutbox);
    }
  }
}

