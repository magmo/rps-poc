import BN from "bn.js";
import { PreFundSetupB, PostFundSetupA, PostFundSetupB, Propose, Accept, Reveal, Resting, Conclude, Play, PreFundSetupA, Result, hashCommitment } from "../../../game-engine/positions";
import { Channel } from "fmg-core";
import { randomHex } from "../../../utils/randomHex";

const libraryAddress = '0x' + '1'.repeat(40);
const channelNonce = '4';
const addrPlayerA = '0x' + 'a'.repeat(40);
const addrPlayerB = '0x' + 'b'.repeat(40);
const participants: [string, string] = [addrPlayerA, addrPlayerB];
const roundBuyIn = new BN(1);
const fiveFive: [BN, BN] = [new BN(5), new BN(5)];
const sixFour: [BN, BN] = [new BN(6), new BN(4)];
const fourSix: [BN, BN] = [new BN(4), new BN(6)];
const nineOne: [BN, BN] = [new BN(9), new BN(1)];
const eightTwo: [BN, BN] = [new BN(8), new BN(2)];
const tenZero: [BN, BN] = [new BN(10), new BN(0)];
const aPlay = Play.Rock;
const salt = randomHex(64);
const preCommit = hashCommitment(aPlay, salt);
const bPlay = Play.Scissors;

const aPlay2 = Play.Paper;
const bPlay2 = Play.Paper;

const sharedProps = {
  addrPlayerA,
  addrPlayerB,
  libraryAddress,
  channelNonce,
  participants,
  roundBuyIn,
  myName: 'Tom',
  opponentName: 'Alex',
};

const channel = new Channel(libraryAddress, channelNonce, participants);

export const standard = {
  ...sharedProps,
  preFundSetupA: new PreFundSetupA(channel, 0, fiveFive, 0, roundBuyIn),
  preFundSetupB: new PreFundSetupB(channel, 1, fiveFive, 1, roundBuyIn),
  postFundSetupA: new PostFundSetupA(channel, 2, fiveFive, 0, roundBuyIn),
  postFundSetupB: new PostFundSetupB(channel, 3, fiveFive, 1, roundBuyIn),
  aPlay,
  salt,
  preCommit,
  bPlay,
  aResult: Result.YouWin,
  bResult: Result.YouLose,
  propose: Propose.createWithPlayAndSalt(channel, 4, fiveFive, roundBuyIn, aPlay, salt),
  accept: new Accept(channel, 5, fourSix, roundBuyIn, preCommit, bPlay),
  reveal: new Reveal(channel, 6, sixFour, roundBuyIn, bPlay, aPlay, salt),
};

export const playTwoRounds = {
  ...standard,
  aPlay2,
  bPlay2,
  resting: new Resting(channel, 7, sixFour, roundBuyIn),
  propose2: Propose.createWithPlayAndSalt(channel, 8, sixFour, roundBuyIn, aPlay2, salt),
  accept2: new Accept(channel, 9, fiveFive, roundBuyIn, preCommit, bPlay2),
  reveal2: new Reveal(channel, 10, sixFour, roundBuyIn, bPlay2, aPlay2, salt),
  resting2: new Resting(channel, 11, sixFour, roundBuyIn),
  conclude: new Conclude(channel, 12, sixFour),
  conclude2: new Conclude(channel, 13, sixFour),
};

export const aResignsAfterOneRound = {
  ...standard,
  resting: new Resting(channel, 7, sixFour, roundBuyIn),
  conclude: new Conclude(channel, 8, sixFour),
  conclude2: new Conclude(channel, 9, sixFour),
};

export const bResignsAfterOneRound = {
  ...standard,
  conclude: new Conclude(channel, 7, sixFour),
  conclude2: new Conclude(channel, 8, sixFour),
};

export const insufficientFunds = {
  preFundSetupA: new PreFundSetupA(channel, 0, nineOne, 0, roundBuyIn),
  preFundSetupB: new PreFundSetupB(channel, 1, nineOne, 1, roundBuyIn),
  postFundSetupA: new PostFundSetupA(channel, 2, nineOne, 0, roundBuyIn),
  postFundSetupB: new PostFundSetupB(channel, 3, nineOne, 1, roundBuyIn),
  aPlay,
  bPlay,
  propose: Propose.createWithPlayAndSalt(channel, 4, nineOne, roundBuyIn, aPlay, salt),
  accept: new Accept(channel, 5, eightTwo, roundBuyIn, preCommit, bPlay),
  reveal: new Reveal(channel, 6, tenZero, roundBuyIn, bPlay, aPlay, salt),
  conclude: new Conclude(channel, 7, tenZero),
  conclude2: new Conclude(channel, 8, tenZero),
};
