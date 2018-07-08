import { Channel, State, toHex32, padBytes32 } from 'fmg-core';
import { soliditySha3 } from 'web3-utils';

import Enum from 'enum';

class RpsGame {
  static restingState({ channnel, resolution, turnNum, stake }) {
    return new RestState(...arguments);
  }
  static proposeState({ channel, resolution, turnNum, stake, aPlay, salt }) {
    let preCommit = ProposeState._hashCommitment(aPlay, salt)
    var args = [].slice.call(arguments);
    return new ProposeState(...args.slice(0,4).concat([preCommit]));
  }
  static acceptState({ channel, resolution, turnNum, stake, preCommit, bPlay }) {
    return new AcceptState(...arguments);
  }
  static revealState({ channel, resolution, turnNum, stake, aPlay, bPlay, salt}) {
    return new RevealState(...arguments);
  }
}

RpsGame.Plays = new Enum(['NONE', 'ROCK', 'PAPER', 'SCISSORS']);

RpsGame.PositionTypes = new Enum(['NONE', 'RESTING', 'ROUNDPROPOSED', 'ROUNDACCEPTED', 'REVEAL', 'NONE'])

export { RpsGame };

class RpsState extends State {
  constructor({ channel, stateType, stateCount, resolution, turnNum, preCommit, stake, aPlay, bPlay, salt }) {
    super({ channel, stateCount, resolution, turnNum });
    this.preCommit = preCommit;
    this.aPlay = aPlay || RpsGame.Plays.NONE;
    this.bPlay = bPlay || RpsGame.Plays.NONE;
    this.salt = salt;
    this.stake = stake;
  }

  _isPreReveal() { return true; }

  static _hashCommitment(play, salt) {
    return soliditySha3(
      { type: 'uint256', value: play.value },
      { type: 'bytes32', value: padBytes32(salt) }
    );
  }

  toHex() {
    return (
      super.toHex() +
      toHex32(this.positionType.value).substr(2) +
      toHex32(this.stake || 0).substr(2) +
      padBytes32(this.preCommit || "0x0").substr(2) +
      toHex32(this.bPlay.value).substr(2) +
      toHex32(this._isPreReveal() ? 0 : this.aPlay.value).substr(2) +
      padBytes32(this._isPreReveal() ? "0x0" : this.salt || "0x0").substr(2)
    );
  }
}

// needs to store/copy game-specific attributes, but needs to behave like a framework state
class InitializationState extends RpsState {
  constructor({ channel, stateCount, resolution, turnNum }) {
    super(...arguments);
    this.stateType = State.StateTypes.PREFUNDSETUP;
    this.positionType = RpsGame.PositionTypes.RESTING;
  }
}

class FundConfirmationState extends RpsState {
  constructor({ channel, stateCount, resolution, turnNum }) {
    super(...arguments);
    this.stateType = State.StateTypes.POSTFUNDSETUP;
    this.positionType = RpsGame.PositionTypes.RESTING;
  }
}

class ProposeState extends RpsState {
  constructor({ channel, resolution, turnNum, stake, preCommit }) {
    super(...arguments);
    this.stateType = State.StateTypes.GAME;
    this.positionType = RpsGame.PositionTypes.ROUNDPROPOSED;
  }
}

class AcceptState extends RpsState {
  constructor({ channel, resolution, turnNum, stake, preCommit, bPlay }) {
    super(...arguments);
    this.stateType = State.StateTypes.GAME;
    this.positionType = RpsGame.PositionTypes.ROUNDACCEPTED;
  }
}

class RevealState extends RpsState {
  constructor({ channel, resolution, turnNum, stake, aPlay, bPlay, salt}) {
    super(...arguments);
    this.stateType = State.StateTypes.GAME;
    this.positionType = RpsGame.PositionTypes.REVEAL;
  }
  _isPreReveal() { return false; };
}

class RestState extends RpsState {
  constructor({ channnel, resolution, turnNum, stake }) {
    super(...arguments);
    this.stateType = State.StateTypes.GAME;
    this.positionType = RpsGame.PositionTypes.RESTING;
    this.stake = stake;
  }
  _isPreReveal() { return false; };
}

class ConclusionState extends RpsState {
  constructor({ channel, resolution, turnNum }) {
    super(...arguments);
    this.stateType = State.StateTypes.CONCLUDE;
    this.positionType = RpsGame.PositionTypes.RESTING;
  }
}
