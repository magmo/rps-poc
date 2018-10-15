export const SHOW_WALLET = 'WALLET.SHOW';
export const HIDE_WALLET = 'WALLET.HIDE';

export const showWallet = () => ({
  type: SHOW_WALLET as typeof SHOW_WALLET,
});
export const hideWallet = () => ({
  type: HIDE_WALLET as typeof HIDE_WALLET,
});

export type ShowWallet = ReturnType<typeof showWallet>;
export type HideWallet = ReturnType<typeof hideWallet>;

