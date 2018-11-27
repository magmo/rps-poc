import { TransactionToSend } from "../domain/TransactionToSend";

export interface Base {
  messageOutbox?: any;
  transactionOutbox?: TransactionToSend;
}

export interface LoggedIn extends Base {
  uid: string;
}

export interface AddressExists extends LoggedIn {
  address: string;
  privateKey: string;
}

export interface ChannelPartiallyOpen extends AddressExists {
  channelId: string;
  libraryAddress: string;
  ourIndex: number;
  participants: [string, string];
  channelNonce: number;
  turnNum: number;
  lastPosition: string;
}

export interface ChannelOpen extends ChannelPartiallyOpen {
  penultimatePosition: string;
}

export interface AdjudicatorExists extends ChannelOpen {
  adjudicator: string;
}


// creators
export function base<T extends Base>(params: T): Base {
  const { messageOutbox, transactionOutbox } = params;
  return { messageOutbox, transactionOutbox };
}

export function loggedIn<T extends LoggedIn>(params: T): LoggedIn {
  return { ...base(params), uid: params.uid };
}

export function addressExists<T extends AddressExists>(params: T): AddressExists {
  const { address, privateKey } = params;
  return { ...loggedIn(params), address, privateKey };
}

export function channelPartiallyOpen<T extends ChannelPartiallyOpen>(params: T): ChannelPartiallyOpen {
  const { channelId, ourIndex, participants, channelNonce, turnNum, lastPosition, libraryAddress } = params;
  return { ...addressExists(params), channelId, ourIndex, participants, channelNonce, turnNum, lastPosition, libraryAddress };
}

export function channelOpen<T extends ChannelOpen>(params: T): ChannelOpen {
  const { penultimatePosition } = params;
  return { ...channelPartiallyOpen(params), penultimatePosition };
}

export function adjudicatorExists<T extends AdjudicatorExists>(params: T): AdjudicatorExists {
  return { ...channelOpen(params), adjudicator: params.adjudicator };
}

