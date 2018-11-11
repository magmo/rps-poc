export interface Base {
  channelId: string;
  ourIndex: number;
  participants: [string, string],
  channelNonce: number;
}

export interface BaseParams extends Base {
  [x: string]: any;
}

export function base(params: BaseParams): Base {
  const { channelId, ourIndex, participants, channelNonce } = params;
  return { channelId, ourIndex, participants, channelNonce };
}

export interface OnePosition extends Base {
  turnNum: number;
  position0: string;
}
export interface OnePositionParams extends BaseParams {
  turnNum: number;
  position0: string;
}
export function onePosition(params: OnePositionParams): OnePosition {
  const { turnNum, position0 } = params;
  return { ...base(params), turnNum, position0 };
}

export interface TwoPositions extends OnePosition {
  position1: string;
}
export interface TwoPositionsParams extends OnePositionParams {
  position1: string;
}
export function twoPositions(params: TwoPositionsParams): TwoPositions {
  return { ...onePosition(params), position1: params.position1 };
}

export interface AdjudicatorExists extends TwoPositions {
  adjudicator: string;
}
export interface AdjudicatorExistsParams extends TwoPositionsParams {
  adjudicator: string;
}
export function adjudicatorExists(params: AdjudicatorExistsParams): AdjudicatorExists {
  return { ...twoPositions(params), adjudicator: params.adjudcator };
}

