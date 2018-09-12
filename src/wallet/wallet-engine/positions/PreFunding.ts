import BN from 'bn.js';

export default class PreFunding {
  opponentAddress: string;
  myAddress: string;
  opponentBalance: BN;
  myBalance: BN;

  constructor({myAddress, opponentAddress, myBalance, opponentBalance}) {
    this.myAddress = myAddress;
    this.opponentAddress = opponentAddress;
    this.myBalance = myBalance;
    this.opponentBalance = opponentBalance;
  }
}
