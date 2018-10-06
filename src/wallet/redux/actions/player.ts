export const TRY_FUNDING_AGAIN = 'WALLETPLAYER.TRYFUNDINGAGAIN';
export const APPROVE_FUNDING = 'WALLETPLAYER.APPROVEFUNDING';
export const DECLINE_FUNDING = 'WALLETPLAYER.DECLINEFUNDING';
export const SELECT_WITHDRAWL_ADDRESS = 'WALLETPLAYER.SELECTWITHDRAWLADDRESS';

export const tryFundingAgain = () => ({
    type: TRY_FUNDING_AGAIN,
});
export const approveFunding = () => ({
    type: APPROVE_FUNDING,
});
export const declineFunding = () => ({
    type: DECLINE_FUNDING,
});
export const selectWithdrawlAddress = (address: string) => ({
    type: SELECT_WITHDRAWL_ADDRESS as typeof SELECT_WITHDRAWL_ADDRESS,
    address,
});

export type SelectWithdrawlAddress = ReturnType<typeof selectWithdrawlAddress>;
export type TryFundingAgain = ReturnType<typeof tryFundingAgain>;
export type ApproveFunding = ReturnType<typeof approveFunding>;
export type DeclineFunding = ReturnType<typeof declineFunding>;