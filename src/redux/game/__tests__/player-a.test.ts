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
  player: Player.PlayerA,
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

describe('player A\'s app', () => {

  describe('when in waitForGameConfirmationA', () => {
    const gameState: state.GameState = {
      ...sharedProps,
      name: state.StateName.WaitForGameConfirmationA,
      latestPosition: preFundSetupA,
    };

    it('can handle receiving preFundSetupB', () => {
      const action = actions.positionReceived(preFundSetupB);
      const updatedState = gameReducer({ messageState, gameState }, action);
      
      expect(updatedState.messageState.walletOutbox).toEqual('FUNDING_REQUESTED');
      expect(updatedState.gameState.name).toEqual(state.StateName.WaitForFunding);
    });

  });


});
