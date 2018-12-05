import { splitSignature } from 'ethers/utils';
import { recover, sign, State, SolidityType } from 'fmg-core';
import { WalletState } from '../../states';

export const validTransition = (fromState: WalletState, toState: State) => {
  // todo: check the game rules

  if (!('turnNum' in fromState)) { return false; }
  if (!('libraryAddress' in fromState)) { return false; }

  return (toState.turnNum === fromState.turnNum + 1) &&
    (toState.channel.channelNonce === fromState.channelNonce) &&
    (toState.channel.participants[0] === fromState.participants[0]) &&
    (toState.channel.participants[1] === fromState.participants[1]) &&
    (toState.channel.channelType === fromState.libraryAddress) &&
    (toState.channel.id === fromState.channelId);
};

export const validSignature = (data: string, signature: string, address: string) => {
  try {
    const { v: vNum, r, s } = splitSignature(signature);
    const v = '0x' + (vNum as number).toString(16);

    const recovered = recover(data, v, r, s);

    return recovered === address;
  } catch (err) {

    return false;
  }
};

export const ourTurn = (state: WalletState) => {
  if (!('turnNum' in state)) { return false; }

  return state.turnNum % 2 !== state.ourIndex;
};

export const signPositionHex = (positionHex: string, privateKey: string) => {
  const signature = sign(positionHex, privateKey) as any;
  return signature.signature;
};

export const signVerificationData = (playerAddress: string, destination: string, channelId: string, privateKey) => {
  const data = [
    { type: SolidityType.address, value: playerAddress },
    { type: SolidityType.address, value: destination },
    { type: SolidityType.bytes32, value: channelId },
  ];
  const signature = sign(data, privateKey) as any;
  return signature.signature;
};