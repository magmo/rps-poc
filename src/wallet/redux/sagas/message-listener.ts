import { actionChannel, take, put } from "redux-saga/effects";

import { LOGIN_SUCCESS } from "../../../redux/login/actions";

import * as incoming from '../../interface/incoming';

import * as actions from "../actions";


// this is the only thing in the wallet which is allowed to listen for app actions
// if we move to an iframe, this would be modified to listen to events on a given
// postMessage channel
export function* messageListener() {
  // todo: restrict this to the application actions we actually
  // want to listen for
  const channel = yield actionChannel('*');

  while (true) {
    // todo: figure out what types action can be
    const action = yield take(channel);

    switch (action.type) {
      case LOGIN_SUCCESS:
        yield put(actions.loggedIn(action.user.uid));
        break;
      case incoming.SIGNATURE_REQUEST:
        yield put(actions.ownPositionReceived(action.data));
        break;
      case incoming.VALIDATION_REQUEST:
        yield put(actions.opponentPositionReceived(action.data, action.signature));
        break;
      default:
        // do nothing
    }
  }
}
