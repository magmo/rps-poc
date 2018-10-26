import BN from 'bn.js';
import { padBytes32 } from 'fmg-core';

export default function bnToHex(number: BN) {
  return padBytes32('0x' + number.toString(16));
}
