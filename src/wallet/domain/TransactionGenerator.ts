

import { TransactionRequest } from "ethers/providers";
import { getSimpleAdjudicatorInterface, getSimpleAdjudicatorBytecode } from '../../contracts/simpleAdjudicatorUtils';
import { Signature } from "./Signature";



export function createForceMoveTransaction(contractAddress: string, fromState: string, toState: string, fromSignature: Signature, toSignature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const v = [fromSignature.v, toSignature.v];
  const r = [fromSignature.r, toSignature.r];
  const s = [fromSignature.s, toSignature.s];
  const data = adjudicatorInterface.functions.forceMove.encode([fromState, toState, v, r, s]);

  return {
    to: contractAddress,
    data,
  };
}

export function createRespondWithMoveTransaction(contractAddress: string, nextState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const { v, r, s } = signature;
  const data = adjudicatorInterface.functions.respondWithMove.encode([nextState, v, r, s]);
  return {
    to: contractAddress,
    data,
  };
}

export function createRefuteTransaction(contractAddress: string, refuteState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const { v, r, s } = signature;
  const data = adjudicatorInterface.functions.refute.encode([refuteState, v, r, s]);
  return {
    to: contractAddress,
    data,
  };
}

export function createDeployTransaction(networkId: number, channelId: string, depositAmount: string) {
  const byteCode = getSimpleAdjudicatorBytecode(networkId);
  const data = getSimpleAdjudicatorInterface().deployFunction.encode(byteCode, [channelId, 2]);
  return {
    data,
    value: depositAmount,
  };
}

export function createDepositTransaction(contractAddress: string, depositAmount: string) {
  return {
    to: contractAddress,
    value: depositAmount,
  };
}
