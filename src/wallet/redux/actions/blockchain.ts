export type BlockchainDeployAdjudicatorAction = ReturnType<typeof deployAdjudicator>;
export type BlockchainAdjudicatorDeployedAction = ReturnType<typeof adjudicatorDeployed>;
export type BlockchainAction =
  | BlockchainDeployAdjudicatorAction
  | BlockchainAdjudicatorDeployedAction;

export const BLOCKCHAIN_DEPLOYADJUDICATOR = 'BLOCKCHAIN.DEPLOYADJUDICATOR';
export const BLOCKCHAIN_ADJUDICATORDEPLOYED = 'BLOCKCHAIN.ADJUDICATORDEPLOYED';
export const BLOCKCHAIN_METAMASKERROR = 'BLOCKCHAIN.METAMASKERROR';
export const BLOCKCHAIN_WRONGNETWORK = 'BLOCKCHAIN.WRONGNETWORK';
export const BLOCKCHAIN_RECEIVEEVENT = 'BLOCKCHAIN.RECEIVEEVENT';

export const deployAdjudicator = (channelId: any) => ({
  type: BLOCKCHAIN_DEPLOYADJUDICATOR,
  channelId,
});
export const adjudicatorDeployed = (address: string) => ({
  type: BLOCKCHAIN_ADJUDICATORDEPLOYED,
  address,
});

export const metamaskError = (error: any) => ({
  type: BLOCKCHAIN_METAMASKERROR,
  error,
});
export const wrongNetwork = (networkId: number) => ({
  type: BLOCKCHAIN_WRONGNETWORK,
  networkId,
});
export const receiveEvent = (event: any) => ({
  type: BLOCKCHAIN_RECEIVEEVENT,
  event,
});
