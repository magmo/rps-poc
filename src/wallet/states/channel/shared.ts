export interface Base {
  channelId: string;
  ourIndex: number;
  participants: [string, string],
  channelNonce: number;
}

export function base<T extends Base>(params: T): Base {
  const { channelId, ourIndex, participants, channelNonce } = params;
  return { channelId, ourIndex, participants, channelNonce };
}

export interface OnePosition extends Base {
  turnNum: number;
  position0: string;
}
export function onePosition<T extends OnePosition>(params: T): OnePosition {
  const { turnNum, position0 } = params;
  return { ...base(params), turnNum, position0 };
}

export interface TwoPositions extends OnePosition {
  position1: string;
}
export function twoPositions<T extends TwoPositions>(params: T): TwoPositions {
  return { ...onePosition(params), position1: params.position1 };
}

export interface AdjudicatorExists extends TwoPositions {
  adjudicator: string;
}
export function adjudicatorExists<T extends AdjudicatorExists>(params: T): AdjudicatorExists {
  return { ...twoPositions(params), adjudicator: params.adjudicator };
}

