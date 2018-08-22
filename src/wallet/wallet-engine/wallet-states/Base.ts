export default class BaseState {
  playerIndex: number; // overwritten by subclass
  readonly isReadyToSend: boolean;
  readonly funded: boolean;
}
