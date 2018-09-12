import { Position } from '../positions';

export default class BaseState<T extends Position> {
  readonly position: T;
  // Overwritten by subclass
  playerIndex: number;
  constructor(position: T) {
      this.position = position;
  }

}