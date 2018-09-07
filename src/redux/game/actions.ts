import { Play } from '../../game-engine/positions';
import { State } from '../../game-engine/application-states';

export const CHOOSE_PLAY = 'GAME.CHOOSE_PLAY';
export const STATE_CHANGED = 'GAME.STATE_CHANGED';

export const choosePlay = (play: Play) => ({
  type: CHOOSE_PLAY as typeof CHOOSE_PLAY,
  play,
});

export const stateChanged = (state: State) => ({
  type: STATE_CHANGED as typeof STATE_CHANGED,
  state,
});

export type ChoosePlay = ReturnType<typeof choosePlay>;
export type StateChanged = ReturnType<typeof stateChanged>;
export type AnyAction =
  | ChoosePlay
  | StateChanged; 
