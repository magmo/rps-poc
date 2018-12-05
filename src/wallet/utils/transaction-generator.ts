

import { TransactionRequest } from "ethers/providers";
import { getSimpleAdjudicatorInterface, getSimpleAdjudicatorBytecode } from "./contract-utils";
import { Signature } from "../domain";

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

export interface ConcludeAndWithdrawArgs {
  contractAddress: string;
  fromState: string;
  toState: string;
  participant: string;
  destination: string;
  channelId: string;
  fromSignature: Signature;
  toSignature: Signature;
  verificationSignature: Signature;
}
export function createConcludeAndWithdrawTransaction(args: ConcludeAndWithdrawArgs): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();

  const v = [args.fromSignature.v, args.toSignature.v, args.verificationSignature.v];
  const r = [args.fromSignature.r, args.toSignature.r, args.verificationSignature.r];
  const s = [args.fromSignature.s, args.toSignature.s, args.verificationSignature.s];
  const { fromState, toState, participant, destination, contractAddress, channelId } = args;
  const data = adjudicatorInterface.functions.concludeAndWithdraw.encode([fromState, toState, participant, destination, channelId, v, r, s]);

  return {
    to: contractAddress,
    data,
  };
}

export function createConcludeTransaction(contractAddress: string, fromState: string, toState: string, fromSignature: Signature, toSignature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const v = [fromSignature.v, toSignature.v];
  const r = [fromSignature.r, toSignature.r];
  const s = [fromSignature.s, toSignature.s];
  const data = adjudicatorInterface.functions.conclude.encode([fromState, toState, v, r, s]);

  return {
    to: contractAddress,
    data,
  };
}

export function createWithdrawTransaction(contractAddress: string, participant: string, destination: string, channelId: string, verificationSignature: Signature) {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const { v, r, s } = verificationSignature;
  const data = adjudicatorInterface.functions.withdraw.encode([participant, destination, channelId, v, r, s]);

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
