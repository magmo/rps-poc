import { put, take, actionChannel, select } from "redux-saga/effects";
import { WalletState } from "../../states";
import { SiteState } from '../../../redux/reducer';

export function* messageSender() {
  // TODO: restrict just to wallet actions
  const channel = yield actionChannel('*');

  while (true) {
    yield take(channel);
    const state: WalletState = yield select((siteState: SiteState) => siteState.wallet);

    if (state.messageOutbox) {
      const messageToSend = state.messageOutbox;
      state.messageOutbox = undefined;
      yield put(messageToSend);
    }
  }
}
