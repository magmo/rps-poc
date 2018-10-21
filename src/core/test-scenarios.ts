import BN from "bn.js";
import { Move } from './moves';
import { Result } from './results';
import * as positions from './positions';
import { randomHex } from "../utils/randomHex";

const libraryAddress = '0x' + '1'.repeat(40);
const channelNonce = 4;
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
const asMove = Move.Rock;
const salt = randomHex(64);
const preCommit = positions.hashCommitment(asMove, salt);
const bsMove = Move.Scissors;

const base = {
  libraryAddress,
  channelNonce,
  participants,
  roundBuyIn,
};

const shared = {
  ...base,
  addrPlayerA,
  addrPlayerB,
  myName: 'Tom',
  opponentName: 'Alex',
};

export const standard = {
  ...shared,
  preFundSetupA: positions.preFundSetupB({...base, turnNum: 0, balances: fiveFive, stateCount: 0}),
  preFundSetupB: positions.preFundSetupB({...base, turnNum: 1, balances: fiveFive, stateCount: 1}),
  postFundSetupA: positions.postFundSetupA({...base, turnNum: 2, balances: fiveFive, stateCount: 0}),
  postFundSetupB: positions.postFundSetupB({...base, turnNum: 3, balances: fiveFive, stateCount: 1}),
  asMove,
  salt,
  preCommit,
  bsMove,
  aResult: Result.YouWin,
  bResult: Result.YouLose,
  propose: positions.proposeFromSalt({...base, turnNum: 4, balances: fiveFive, asMove, salt}),
  accept:  positions.accept({...base, turnNum: 5, balances: fourSix, preCommit, bsMove}),
  reveal:  positions.reveal({...base, turnNum: 6, balances: sixFour, bsMove, asMove, salt}),
};

export const aResignsAfterOneRound = {
  ...standard,
  resting: positions.resting({...base, turnNum: 7, balances: sixFour }),
  conclude: positions.conclude({...base, turnNum: 8, balances: sixFour }),
  conclude2: positions.conclude({...base, turnNum: 9, balances: sixFour }),
};

export const bResignsAfterOneRound = {
  ...standard,
  conclude: positions.conclude({...base, turnNum: 7, balances: sixFour }),
  conclude2: positions.conclude({...base, turnNum: 8, balances: sixFour }),
};

export const insufficientFunds = {
  preFundSetupA: positions.preFundSetupB({...base, turnNum: 0, balances: nineOne, stateCount: 0}),
  preFundSetupB: positions.preFundSetupB({...base, turnNum: 1, balances: nineOne, stateCount: 1}),
  postFundSetupA: positions.postFundSetupA({...base, turnNum: 2, balances: nineOne, stateCount: 0}),
  postFundSetupB: positions.postFundSetupB({...base, turnNum: 3, balances: nineOne, stateCount: 1}),
  asMove,
  bsMove,
  propose: positions.proposeFromSalt({...base, turnNum: 4, balances: nineOne, asMove, salt}),
  accept:  positions.accept({...base, turnNum: 5, balances: eightTwo, preCommit, bsMove}),
  reveal:  positions.reveal({...base, turnNum: 6, balances: tenZero, bsMove, asMove, salt}),
  conclude: positions.conclude({...base, turnNum: 7, balances: tenZero }),
  conclude2: positions.conclude({...base, turnNum: 8, balances: tenZero }),
};