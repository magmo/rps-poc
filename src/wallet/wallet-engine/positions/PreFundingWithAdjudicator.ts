import { PreFunding } from '.';

export default class PreFundingWithAdjudicator extends PreFunding {
  adjudicatorAddress: string;
  constructor({ adjudicatorAddress, myAddress, opponentAddress, myBalance, opponentBalance }) {
    super({ myAddress, opponentAddress, myBalance, opponentBalance });
    this.adjudicatorAddress = adjudicatorAddress;
  }
}
