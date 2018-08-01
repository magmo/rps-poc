import { State } from 'fmg-core';
import { packRestingAttributes } from '.';

export default class PostFundSetup extends State {
  stake: number;

  constructor(
    channel,
    turnNum: number,
    balances: number[],
    stateCount: number,
    stake: number,
  ) {
    const stateType = State.StateTypes.POSTFUNDSETUP;
    super({ channel, stateType, turnNum, stateCount, resolution: balances });
    this.stake = stake;
  }

  toHex() {
    return super.toHex() + packRestingAttributes(this.stake);
  }
}
