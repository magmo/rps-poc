import { takeEvery, select, call } from 'redux-saga/effects';
import { reduxSagaFirebase } from '../../gateways/firebase';

import * as gameActions from './actions';

export default function* gameRootSaga() {
  yield [
    takeEvery(gameActions.UPDATE_PROFILE, syncProfileSaga),
  ];
}

// put these here instead of importing from store to avoid cyclic references
// todo: do this better
const getUid = (storeObj: any) => storeObj.login.user.uid;
const getProfile = (storeObj: any) => storeObj.login.profile;

function * syncProfileSaga() {
  const uid = yield select(getUid);
  const profile = yield select(getProfile);

  yield call(reduxSagaFirebase.database.update, `/profiles/${uid}`, profile);
}
