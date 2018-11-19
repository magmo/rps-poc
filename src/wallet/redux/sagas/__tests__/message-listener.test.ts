import { put } from 'redux-saga/effects';

import { loginSuccess } from '../../../../redux/login/actions';

import { messageListener } from '../message-listener';
import { loggedIn } from '../../actions';
import { channel } from 'redux-saga';

describe('message listener', () => {
  const saga = messageListener();

  // having to do this next part is a bit nasty
  saga.next();
  const mockActionChannel = channel();
  saga.next(mockActionChannel);

  it('converts LOGIN_SUCCESS into a WALLET.LOGGED_IN', () => {
    const output = saga.next(loginSuccess({ uid: 'abc123' }, '0xlibraryAddress')).value;

    expect(output).toEqual(put(loggedIn('abc123')));
  });
});
