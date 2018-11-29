import { signPositionHex, validSignature } from '../utils';
import * as scenarios from '../../../../core/test-scenarios';

const s = scenarios.standard;

const itSigns = (name, positionHex, key, signature) => {
  it(`calculates the signature of ${name}`, () => {
    expect(signPositionHex(positionHex, key)).toEqual(signature);
  });
};

describe('signPositionHex', () => {
  itSigns('PreFundSetupA', s.preFundSetupAHex, s.asPrivateKey, s.preFundSetupASig);
  itSigns('PreFundSetupB', s.preFundSetupBHex, s.bsPrivateKey, s.preFundSetupBSig);
  itSigns('Propose', s.proposeHex, s.asPrivateKey, s.proposeSig);
  itSigns('Accept', s.acceptHex, s.bsPrivateKey, s.acceptSig);
});

const itChecksSig = (name, positionHex, signature, address) => {
  it(`checks the signature of ${name}`, () => {
    expect(validSignature(positionHex, signature, address)).toEqual(true);
  });
};

describe('validSignature', () => {
  itChecksSig('PreFundSetupA', s.preFundSetupAHex, s.preFundSetupASig, s.asAddress);
  itChecksSig('PreFundSetupB', s.preFundSetupBHex, s.preFundSetupBSig, s.bsAddress);
  itChecksSig('Propose', s.proposeHex, s.proposeSig, s.asAddress);
  itChecksSig('Accept', s.acceptHex, s.acceptSig, s.bsAddress);
});
