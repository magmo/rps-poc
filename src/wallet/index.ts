export type WalletAction =
  | ReturnType<typeof WalletAction.walletRetrieved>
  | ReturnType<typeof WalletAction.walletRequest>;
export type WalletRetrievedAction = ReturnType<typeof WalletAction.walletRetrieved>;
export type WalletRequestedAction = ReturnType<typeof WalletAction.walletRequest>;
export enum WalletActionType {
  WALLET_RETRIEVED = 'WALLET.RETRIEVED',
  WALLET_REQUESTED = 'WALLET.REQUESTED',
}

export const WalletAction = {
  walletRetrieved: (wallet: Wallet) => ({
    type: WalletActionType.WALLET_RETRIEVED as typeof WalletActionType.WALLET_RETRIEVED,
    wallet,
  }),
  walletRequest: (uid: string) => ({
    type: WalletActionType.WALLET_REQUESTED as typeof WalletActionType.WALLET_REQUESTED,
    uid,
  }),
};

export type WalletFundingAction = WalletFundedAction | WalletFundingRequestAction;
export type WalletFundingRequestAction = ReturnType<
  typeof WalletFundingAction.walletFundingRequest
>;
export type WalletFundedAction = ReturnType<typeof WalletFundingAction.walletFunded>;

export enum WalletFundingActionType {
  WALLETFUNDING_REQUEST = 'WALLETFUNDING.REQUEST',
  WALLETFUNDING_FUNDED = 'WALLETFUNDING_FUNDED',
}

export const WalletFundingAction = {
  walletFundingRequest: (wallet: Wallet, playerIndex:number) => ({
    type: WalletFundingActionType.WALLETFUNDING_REQUEST as typeof WalletFundingActionType.WALLETFUNDING_REQUEST,
    wallet,
    playerIndex,
  }),
  walletFunded: ( adjucator: string ) => ({
    type: WalletFundingActionType.WALLETFUNDING_FUNDED as typeof WalletFundingActionType.WALLETFUNDING_FUNDED,
    adjucator,
  }),
};

export interface Wallet {
  privateKey: string;
  address: string;
  sign(stateString: string): string;
}
