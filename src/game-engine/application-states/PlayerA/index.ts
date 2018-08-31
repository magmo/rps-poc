import BaseState from '../Base';
import { Player } from '..';
import {
  Play,
  Position,
  PreFundSetup,
  PostFundSetup,
  Propose,
  Reveal,
  Resting,
  Conclude,
  calculateResult,
} from '../../positions';

export enum PlayerAStateType {
  WAIT_FOR_PRE_FUND_SETUP = 'PLAYER_A_STATE_TYPE.WAIT_FOR_PRE_FUND_SETUP',
  WAIT_FOR_FUNDING = 'PLAYER_A_STATE_TYPE.WAIT_FOR_FUNDING',
  WAIT_FOR_POST_FUND_SETUP = 'PLAYER_A_STATE_TYPE.WAIT_FOR_POST_FUND_SETUP',
  CHOOSE_PLAY = 'PLAYER_A_STATE_TYPE.CHOOSE_PLAY',
  WAIT_FOR_ACCEPT = 'PLAYER_A_STATE_TYPE.WAIT_FOR_ACCEPT',
  WAIT_FOR_RESTING = 'PLAYER_A_STATE_TYPE.WAIT_FOR_RESTING',
  WAIT_FOR_CONCLUDE = 'PLAYER_A_STATE_TYPE.WAIT_FOR_CONCLUDE',
  INSUFFICIENT_FUNDS = 'PLAYER_A_STATE_TYPE.INSUFFICIENT_FUNDS',
}

class BasePlayerA<T extends Position> extends BaseState<T> {
  readonly player = Player.PlayerA;
}

export class WaitForPreFundSetup extends BasePlayerA<PreFundSetup> {
  readonly type = PlayerAStateType.WAIT_FOR_PRE_FUND_SETUP;
  readonly isReadyToSend = false;
}

export class WaitForFunding extends BasePlayerA<PreFundSetup> {
  readonly type = PlayerAStateType.WAIT_FOR_FUNDING;
  readonly isReadyForFunding = false;
  readonly isReadyToSend = false;
}

export class WaitForPostFundSetup extends BasePlayerA<PostFundSetup> {
  readonly type = PlayerAStateType.WAIT_FOR_POST_FUND_SETUP;
  readonly isReadyToSend = false;
}


export class ReadyToChooseAPlay extends BasePlayerA<PostFundSetup | Resting> {
  readonly type = PlayerAStateType.CHOOSE_PLAY;
  readonly isReadyToSend = false;
}

export class WaitForAccept extends BasePlayerA<Propose> {
  readonly type = PlayerAStateType.WAIT_FOR_ACCEPT;
  aPlay: Play;
  salt: string;
  readonly isReadyToSend = false;

  constructor({ position, aPlay, salt }) {
    super({ position });
    this.aPlay = aPlay;
    this.salt = salt;
  }
}

export class WaitForResting extends BasePlayerA<Reveal> {
  readonly type = PlayerAStateType.WAIT_FOR_ACCEPT;
  readonly isReadyToSend = false;

  get aPlay() { return this.position.aPlay; }
  get bPlay() { return this.position.bPlay; }
  get salt() { return this.position.salt; }
  get result() { return calculateResult(this.aPlay, this.bPlay); }
}

// todo: what should Position be here?
export class InsufficientFunds extends BasePlayerA<Position> {
  readonly type = PlayerAStateType.INSUFFICIENT_FUNDS;
  readonly isReadyToSend = false;
}

export default class WaitForConclude extends BasePlayerA<Conclude> {
  readonly type = PlayerAStateType.WAIT_FOR_CONCLUDE;
  readonly isReadyToSend = false;
}

export type PlayerAState = (
  | WaitForPreFundSetup
  | WaitForFunding
  | WaitForPostFundSetup
  | ReadyToChooseAPlay
  | WaitForAccept
  | WaitForResting
  | InsufficientFunds
  | WaitForConclude
);
