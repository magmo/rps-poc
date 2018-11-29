
import { Signature } from "./Signature";
import { TransactionRequest } from "ethers/providers";
import { getSimpleAdjudicatorInterface } from '../../contracts/simpleAdjudicatorUtils';
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

export function createRefuteransaction(contractAddress: string, refuteState: string, signature: Signature): TransactionRequest {
  const adjudicatorInterface = getSimpleAdjudicatorInterface();
  const data = adjudicatorInterface.functions.refute.encode([refuteState, ...convertSignature(signature)]);
  return {
    to: contractAddress,
    data,
  };
}

function convertSignature(signature: Signature) {
  // TODO: Move this into the Signature class
  const v = Array.from(utils.arrayify('0x' + signature.v.toString(16)));
  const r = [signature.r];
  const s = [signature.s];
  return [v, r, s];
}