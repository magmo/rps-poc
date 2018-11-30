
import { Signature } from "./Signature";
import { TransactionRequest } from "ethers/providers";
import { getSimpleAdjudicatorInterface, getSimpleAdjudicatorBytecode } from '../../contracts/simpleAdjudicatorUtils';
import { utils } from 'ethers';

export function createForceMoveTransaction(contractAddress: string, fromState: string, toState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const data = adjudicatorInterface.functions.forceMove.encode([fromState, toState, ...convertSignature(signature)]);
  return {
    to: contractAddress,
    data,
  };
}

export function createRespondWithMoveTransaction(contractAddress: string, nextState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const data = adjudicatorInterface.functions.respondWithMove.encode([nextState, ...convertSignature(signature)]);
  return {
    to: contractAddress,
    data,
  };
}

export function createRefuteTransaction(contractAddress: string, refuteState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const data = adjudicatorInterface.functions.refute.encode([refuteState, ...convertSignature(signature)]);
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

function convertSignature(signature: Signature) {
  // TODO: Move this into the Signature class
  const v = Array.from(utils.arrayify('0x' + signature.v.toString(16)));
  const r = [signature.r];
  const s = [signature.s];
  return [v, r, s];
}