import BN from "bn.js";
import { PreFundSetupB, PostFundSetupA, PostFundSetupB, Propose, Accept, Reveal, Resting, Conclude, Play, PreFundSetupA } from "../../../game-engine/positions";
import { Channel } from "fmg-core";
import { gameReducer } from '../reducer';
import { Player } from '../../../game-engine/application-states';
import * as actions from '../actions';
import * as state from '../state';


const libraryAddress = '0x123';
const channelNonce = '4';
const participants: [string, string] = ['0xa', '0xb'];
const roundBuyIn = new BN(1);
const initialBalances: [BN, BN] = [new BN(5), new BN(5)];
const aWinsBalances: [BN, BN] = [new BN(6), new BN(4)];
const bWinsBalances: [BN, BN] = [new BN(4), new BN(6)];
const preCommit = '0x12345a';
const aPlay = Play.Rock;
const bPlay = Play.Scissors;
const salt = '0x123';


const sharedProps = {
  libraryAddress,
  channelNonce,
  participants,
  turnNum: 0,
  balances: initialBalances,
  stateCount: 0,
  roundBuyIn,
  myName: 'Tom',
  opponentName: 'Alex',
}
const channel = new Channel(libraryAddress, channelNonce, participants);
const preFundSetupA = new PreFundSetupA(channel, 0, initialBalances, 0, roundBuyIn);
const preFundSetupB = new PreFundSetupB(channel, 1, initialBalances, 0, roundBuyIn);
const postFundSetupA = new PostFundSetupA(channel, 2, initialBalances, 0, roundBuyIn);
const postFundSetupB = new PostFundSetupB(channel, 3, initialBalances, 0, roundBuyIn);
const propose = new Propose(channel, 0, initialBalances, roundBuyIn, preCommit);
const accept = new Accept(channel, 0, initialBalances, roundBuyIn, preCommit, bPlay);
const reveal = new Reveal(channel, 0, initialBalances, roundBuyIn, bPlay, aPlay, salt);
const resting = new Resting(channel, 0, initialBalances, roundBuyIn);

const waitForGameConfirmationA = { ...sharedProps }
const confirmGameB = { ...sharedProps }

const messageState = { walletOutbox: null, opponentOutbox: null, actionToRetry: null };

const itSends = (position, state) => {
  it(`sends ${position.constructor.name}`, () => {
    expect(state.messageState.opponentOutbox).toEqual(position);
  });
};

const itTransitionsTo = (stateName, state) => {
  it(`transitions to ${stateName}`, () => {
    expect(state.gameState.name).toEqual(stateName);
  });
};

describe('player A\'s app', () => {
  const aProps = { ...sharedProps, player: Player.PlayerA as Player.PlayerA };

  describe('when in waitForGameConfirmationA', () => {
    const gameState: state.WaitForGameConfirmationA = {
      ...aProps,
      name: state.StateName.WaitForGameConfirmationA,
      latestPosition: preFundSetupA,
    };

    describe('when receiving preFundSetupB', () => {
      const action = actions.positionReceived(preFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

      it('requests funding from the wallet', () => {
        expect(updatedState.messageState.walletOutbox).toEqual('FUNDING_REQUESTED');
      });

      it('transitions to WaitForFunding', () => {
        expect(updatedState.gameState.name).toEqual(state.StateName.WaitForFunding);
      });
    })
  });

  describe('when in waitForFunding', () => {
    const gameState: state.WaitForFunding = {
      ...aProps,
      name: state.StateName.WaitForFunding,
      latestPosition: preFundSetupB,
    };

    describe('when funding is successful', () => {
      const action = actions.fundingSuccess();
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(postFundSetupA, updatedState);
      itTransitionsTo(state.StateName.WaitForPostFundSetup, updatedState);
    });
  });

  describe('when in WaitForPostFundSetup', () => {
    describe('when PostFundSetupB arrives', () => {
      it('transitions to PickMove', () => {});
    });
  });

  describe('when in PickMove', () => {
    describe('when a move is chosen', () => {
      it('sends Propose', () => {});
      it('transitions to WaitForOpponentToPickMoveA', () => {});
    });
  });

  describe('when in WaitForOpponentToPickMoveA', () => {
    describe('when Accept arrives', () => {
      it('sends Reveal', () => {});

      describe('when enough funds to continue', () => {
        it('transitions to PlayAgain', () => {});
      });

      describe('when not enough funds to continue', () => {
        it('transitions to InsufficientFunds', () => {});
      });
    });
  });

  describe('when in PlayAgain', () => {
    describe('if the player decides to continue', () => {
      it('transitions to WaitForRestingA', () => {});
    });
    describe('if the player decides not to continue', () => {
      it('transitions to WaitToResign', () => {});
    });

    describe('if Resting arrives', () => {
      it('stores the action for later', () => {});
      describe('if the player decides to continue', () => {
        it('transitions to PickMove', () => {});
      });
      describe('if the player decides not to continue', () => {
        it('sends Conclude', () => {});
        it('transitions to WaitForResignationAcknowledgement', () => {});
      });

    });
  });

  describe('when in InsufficientFunds', () => {
    describe('when Conclude arrives', () => {
      it('sends Conclude', () => {});
      it('transitions to GameOver', () => { });
    });
  });

  describe('when in WaitForResignationAcknowledgement', () => {
    describe('when Conclude arrives', () => {
      it('transitions to GameOver', () => { });
    });
  });

});
