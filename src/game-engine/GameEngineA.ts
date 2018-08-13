import { Channel } from 'fmg-core';

import * as State from './application-states/PlayerA';
import Move from './Move';
import ChannelWallet from './ChannelWallet';
import decodePledge from './positions/decode';
import { calculateResult, Result, Play }  from './positions';
import PreFundSetup from './positions/PreFundSetup';
import PostFundSetup from './positions/PostFundSetup';
import Propose from './positions/Propose';
import Accept from './positions/Accept';
import Reveal from './positions/Reveal';
import Resting from './positions/Resting';
import Conclude from './positions/Conclude';

const fakeGameLibraryAddress = '0xc1912fee45d61c87cc5ea59dae31190fffff232d';

export default class GameEngineA {
  static setupGame({ opponent, stake, balances, wallet }: 
    { opponent: string, stake: number, balances: number[], wallet: ChannelWallet }
  ) {
    const participants = [wallet.address, opponent];
    const channel = new Channel(fakeGameLibraryAddress, 456, participants);

    const nextPledge = new PreFundSetup(channel, 0, balances, 0, stake);
    const move = wallet.sign(nextPledge.toHex());

    const appState = new State.ReadyToSendPreFundSetupA({
      channel,
      stake,
      balances,
      move,
    });

    return new GameEngineA(wallet, appState);
  }

  static fromState({ state, wallet }: { state: State.PlayerAState, wallet: ChannelWallet }) {
    return new GameEngineA(wallet, state);
  }

  channelWallet: ChannelWallet;
  state: any;
 
  constructor(channelWallet, state) {
    this.channelWallet = channelWallet;
    this.state = state;
  }

  moveSent() {
    switch(this.state.constructor) {
      case State.ReadyToSendPreFundSetupA:
        return this.transitionTo(
          new State.WaitForPreFundSetupB({
            ...this.state.commonAttributes,
            move: this.state.move,
          })
        );
      case State.ReadyToSendPostFundSetupA:
        return this.transitionTo(
          new State.WaitForPostFundSetupB({
            ...this.state.commonAttributes,
            adjudicator: this.state.adjudicator,
            move: this.state.move,
          })
        );
      case State.ReadyToSendPropose:
        return this.transitionTo(
          new State.WaitForAccept({
            ...this.state.commonAttributes,
            adjudicator: this.state.adjudicator,
            aPlay: this.state.aPlay,
            salt: this.state.salt,
            move: this.state.move,
          })
        );
      case State.ReadyToSendReveal:
        return this.transitionTo(
          new State.WaitForResting(this.state)
        );
      default:
        // todo: should we error here?
        return this.state;
    }
  }

  receiveMove(move: Move) {
    const positionReceived = decodePledge(move.state);

    switch(positionReceived.constructor) {
      case PreFundSetup:
        return this.receivedPreFundSetup(positionReceived as PreFundSetup);
      case PostFundSetup:
        return this.receivedPostFundSetup(positionReceived as PostFundSetup);
      case Accept:
        return this.receivedAccept(positionReceived as Accept);
      case Resting:
        return this.receivedResting(positionReceived as Resting);
      case Conclude:
        return this.receivedConclude(positionReceived as Conclude);
      default:
        // raise an error?
        return this.state;
    }
  }

  transactionSent() {
    if (!(this.state instanceof State.ReadyToDeploy)) { return this.state };

    const { channel, stake, balances } = this.state;

    return this.transitionTo(
      new State.WaitForBlockchainDeploy({ channel, stake, balances })
    );
  }

  receiveEvent(event) {
    const { channel, stake, balances } = this.state;

    // todo: might be cleaner to switch on event.type, when we have that
    switch(this.state.constructor) {
      case State.WaitForBlockchainDeploy:
        const adjudicator = event.adjudicator;
        return this.transitionTo(
          new State.WaitForBToDeposit({ channel, stake, balances, adjudicator })
        );
      case State.WaitForBToDeposit:
        const stateCount  = 0;
        const turnNum = 2;
        const newPosition = new PostFundSetup(channel, turnNum, balances, stateCount, stake);
        const move = this.channelWallet.sign(newPosition.toHex());

        return this.transitionTo(
          new State.ReadyToSendPostFundSetupA({
            channel,
            stake,
            balances,
            adjudicator: this.state.adjudicator,
            move,
          })
        );
      default:
        return this.state;
    }
  }

  choosePlay(aPlay: Play) {
    if (!(this.state instanceof State.ReadyToChooseAPlay)) { return this.state };

    const { balances, turnNum, stake, channel, adjudicator } = this.state;

    const salt = 'salt'; // todo: make random

    const newPosition = Propose.createWithPlayAndSalt(
      channel,
      turnNum,
      balances,
      stake,
      aPlay,
      salt
    );

    const move = this.channelWallet.sign(newPosition.toHex());

    return this.transitionTo(
      new State.ReadyToSendPropose({
        channel,
        stake,
        balances, 
        adjudicator,
        aPlay,
        salt,
        move,
      })
    );
  }


  conclude() {
    // problem - we don't necessarily have all the stuff here :()

    // const concludePledge = new Conclude(
    //   oldState.channel,
    //   oldPledge.turnNum + 1,
    //   oldState.balances
    // );

    // const concludeMove = this.channelWallet.sign(concludePledge.toHex());

    // if (oldPledge.turnNum % 2 === 0) {
    //   newState = new State.ReadyToSendConcludeA({
    //     ...oldState.commonAttributes,
    //     adjudicator: oldState.adjudicator,
    //     move: concludeMove,
    //   });
    // } else if (oldPledge.turnNum % 2 === 1) {
    //   newState = new ApplicationStatesB.ReadyToSendConcludeB({
    //     ...oldState.commonAttributes,
    //     adjudicator: oldState.adjudicator,
    //     move: concludeMove,
    //   });
    // }
    return this.state;
  }

  transitionTo(state) {
    this.state = state;
    return state;
  }

  receivedPreFundSetup(position: PreFundSetup) {
    if (!(this.state instanceof State.WaitForPreFundSetupB)) { return this.state };

    const { channel, stake, balances } = this.state;
    const transaction = 'add transaction logic here';

    return this.transitionTo(
      new State.ReadyToDeploy({ channel, stake, balances, transaction })
    );
  }

  receivedPostFundSetup(position: PostFundSetup) {
    if (!(this.state instanceof State.WaitForPostFundSetupB)) { return this.state };

    const { channel, stake, balances, adjudicator } = this.state;
    const turnNum = position.turnNum + 1;

    return this.transitionTo(
      new State.ReadyToChooseAPlay({ channel, stake, balances, adjudicator, turnNum })
    );
  }

  receivedAccept(position: Accept) {
    if (!(this.state instanceof State.WaitForAccept)) { return this.state };

    const { channel, stake, resolution: oldBalances, bPlay, turnNum } = position;
    const { adjudicator, aPlay, salt } = this.state;
    const result = calculateResult(aPlay, bPlay);

    const balances = [...oldBalances];
    if (result === Result.Tie) {
      balances[0] += stake;
      balances[1] -= stake;
    } else if (result === Result.AWon) {
      balances[0] += 2 * stake;
      balances[1] -= 2 * stake;
    }

    const nextPledge = new Reveal(channel, turnNum + 1, balances, stake, bPlay, aPlay, salt);
    const move = this.channelWallet.sign(nextPledge.toHex());

    return this.transitionTo(
      new State.ReadyToSendReveal({
        channel,
        stake,
        balances,
        adjudicator,
        aPlay,
        bPlay,
        result,
        salt,
        move,
      })
    );

  }

  receivedResting(position: Resting) {
    if (!(this.state instanceof State.WaitForResting)) { return this.state };

    const { channel, turnNum: oldTurnNum, resolution: balances, stake } = position;
    const { adjudicator } = this.state;
    const turnNum = oldTurnNum + 1;

    return this.transitionTo(
      new State.ReadyToChooseAPlay({channel, stake, balances, adjudicator, turnNum })
    );
  }

  receivedConclude(position: Conclude) {
    const { channel, resolution: balances } = position;
    const { adjudicator } = this.state;

    // todo: need a move. Might also need an intermediate state here
    return this.transitionTo(
      new State.ReadyToSendConcludeA({ channel, balances, adjudicator })
    )
  }
}
