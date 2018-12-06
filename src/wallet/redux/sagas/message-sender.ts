import { put } from "redux-saga/effects";
import { ResponseAction } from "../../interface/outgoing";

export function* messageSender(action: ResponseAction) {
  yield put(action);
}
