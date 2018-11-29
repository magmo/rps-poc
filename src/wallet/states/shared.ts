export enum DisplayMode {
  None,
  Minimized,
  Full,
}

export interface Base {
  displayMode: DisplayMode;
}

export interface AddressExists extends Base {
  address: string;
  privateKey: string;
}

export interface ChannelPartiallyOpen extends AddressExists {
  channelId: string;
  ourIndex: number;
  participants: [string, string];
  channelNonce: number;
  turnNum: number;
  position0: string;
}

export interface ChannelOpen extends ChannelPartiallyOpen {
  position1: string;
}

export function base<T extends Base>(params: T): Base {
  return { displayMode: params.displayMode };
}

export function addressExists<T extends AddressExists>(params: T): AddressExists {
  const { address, privateKey } = params;
  return { ...base(params), address, privateKey };
}

export function channelPartiallyOpen<T extends ChannelPartiallyOpen>(params: T): ChannelPartiallyOpen {
  const { channelId, ourIndex, participants, channelNonce, turnNum, position0 } = params;
  return { ...addressExists(params), channelId, ourIndex, participants, channelNonce, turnNum, position0 };
}

export function channelOpen<T extends ChannelOpen>(params: T): ChannelOpen {
  const { position1 } = params;
  return { ...channelPartiallyOpen(params), position1 };
}

export interface AdjudicatorExists extends ChannelOpen {
  adjudicator: string;
}
export function adjudicatorExists<T extends AdjudicatorExists>(params: T): AdjudicatorExists {
  return { ...channelOpen(params), adjudicator: params.adjudicator };
}

