import BN from 'bn.js';
import {BigNumber} from 'ethers/utils';

export default function bigNumberToBN(bigNumber: BigNumber): BN {
  return new BN(bigNumber.toString(),10);
}
