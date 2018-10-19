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
const bLowFundsBalances: [BN, BN] = [new BN(9), new BN(1)];
const insufficientFundsBalances: [BN, BN] = [new BN(10), new BN(0)];
const aPlay = Play.Rock;
const salt = '0x123';
const preCommit = '0x12345a';
const bPlay = Play.Scissors;


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
const preFundSetupB = new PreFundSetupB(channel, 1, initialBalances, 1, roundBuyIn);
const postFundSetupA = new PostFundSetupA(channel, 2, initialBalances, 0, roundBuyIn);
const postFundSetupB = new PostFundSetupB(channel, 3, initialBalances, 1, roundBuyIn);
const propose = Propose.createWithPlayAndSalt(channel, 4, initialBalances, roundBuyIn, aPlay, salt);
const accept = new Accept(channel, 5, initialBalances, roundBuyIn, preCommit, bPlay);
const reveal = new Reveal(channel, 6, initialBalances, roundBuyIn, bPlay, aPlay, salt);
const revealInsufficientFunds = new Reveal(channel, 6, insufficientFundsBalances, roundBuyIn, bPlay, aPlay, salt);
const resting = new Resting(channel, 7, initialBalances, roundBuyIn);

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

const itStoresAction = (action, state) => {
  it(`stores action to retry`, () => {
    expect(state.messageState.actionToRetry).toEqual(action);
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
    const gameState: state.WaitForPostFundSetup = {
      ...aProps,
      name: state.StateName.WaitForPostFundSetup,
      latestPosition: postFundSetupA,
    };
    describe('when PostFundSetupB arrives', () => {
      const action = actions.positionReceived(postFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);

      itTransitionsTo(state.StateName.PickMove, updatedState)
    });
  });

  describe('when in PickMove', () => {
    const gameState: state.PickMove = {
      ...aProps,
      name: state.StateName.PickMove,
      latestPosition: postFundSetupB,
    };

    describe('when a move is chosen', () => {
      const action = actions.choosePlay(aPlay);
      // todo: will need to stub out the randomness in the salt somehow
      const updatedState = gameReducer({ messageState, gameState }, action);

      itSends(propose, updatedState);
      itTransitionsTo(state.StateName.WaitForOpponentToPickMoveA, updatedState);

      it('stores the move and salt', () => {
        const gameState = updatedState.gameState as state.WaitForOpponentToPickMoveA;
        expect(gameState.myMove).toEqual(aPlay);
        expect(gameState.salt).toEqual(salt);
      });
    });
  });

  describe('when in WaitForOpponentToPickMoveA', () => {
    const gameState: state.WaitForOpponentToPickMoveA = {
      ...aProps,
      name: state.StateName.WaitForOpponentToPickMoveA,
      latestPosition: postFundSetupB,
      myMove: aPlay,
      salt: salt,
    };
    describe('when Accept arrives', () => {
      const action = actions.positionReceived(accept);

      describe('when enough funds to continue', () => {
        const updatedState = gameReducer({ messageState, gameState }, action);

        itSends(reveal, updatedState);
        itTransitionsTo(state.StateName.PlayAgain, updatedState);
      });

      describe('when not enough funds to continue', () => {
        const gameState2 = { ...gameState, balances: bLowFundsBalances };
        const updatedState = gameReducer({ messageState, gameState: gameState2 }, action);

        itSends(revealInsufficientFunds, updatedState);
        itTransitionsTo(state.StateName.InsufficientFunds, updatedState);
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
