import { OpponentsTypes } from '../actions/opponents';

const initialState = [];

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case OpponentsTypes.OPPONENTS.SYNC:
      return action.opponents;
    default:
      return state
  }
}