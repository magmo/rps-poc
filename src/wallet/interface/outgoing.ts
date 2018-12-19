// FUNDING
// =======

export const FUNDING_SUCCESS = 'WALLET.FUNDING.SUCCESS';
export const FUNDING_FAILURE = 'WALLET.FUNDING.FAILURE';

export const fundingSuccess = (channelId, position: string) => ({
  type: FUNDING_SUCCESS as typeof FUNDING_SUCCESS,
  channelId,
  position,
});
export const fundingFailure = (channelId, reason) => ({
  type: FUNDING_FAILURE as typeof FUNDING_FAILURE,
  channelId,
  reason,
});

export type FundingSuccess = ReturnType<typeof fundingSuccess>;
export type FundingFailure = ReturnType<typeof fundingFailure>;
export type FundingResponse = FundingSuccess | FundingFailure;

// CHANNELS
// ========

export const CHANNEL_OPENED = 'WALLET.CHANNEL.OPENED';
export const CHANNEL_CLOSED = 'WALLET.CHANNEL.CLOSED';

export const channelOpened = (channelId: string) => ({
  type: CHANNEL_OPENED as typeof CHANNEL_OPENED,
  channelId,
});
export const channelClosed = (walletId: string) => ({
  type: CHANNEL_CLOSED as typeof CHANNEL_CLOSED,
  walletId,
});

export type ChannelOpened = ReturnType<typeof channelOpened>;
export type ChannelClosed = ReturnType<typeof channelClosed>;

// VALIDATION
// ==========

export const VALIDATION_SUCCESS = 'WALLET.VALIDATION.SUCCESS';
export const VALIDATION_FAILURE = 'WALLET.VALIDATION.FAILURE';

export const validationSuccess = () => ({
  type: VALIDATION_SUCCESS as typeof VALIDATION_SUCCESS,
});
export const validationFailure = (reason: string) => ({
  type: VALIDATION_FAILURE as typeof VALIDATION_FAILURE,
  reason,
});

export type ValidationSuccess = ReturnType<typeof validationSuccess>;
export type ValidationFailure = ReturnType<typeof validationFailure>;
export type ValidationResponse = ValidationSuccess | ValidationFailure;


// SIGNATURE
// =========

export const SIGNATURE_SUCCESS = 'WALLET.SIGNATURE.SUCCESS';
export const SIGNATURE_FAILURE = 'WALLET.SIGNATURE.FAILURE';

export const signatureSuccess = (signature: string) => ({
  type: SIGNATURE_SUCCESS as typeof SIGNATURE_SUCCESS,
  signature,
});
export const signatureFailure = (reason: string) => ({
  type: SIGNATURE_FAILURE as typeof SIGNATURE_FAILURE,
  reason,
});

export type SignatureSuccess = ReturnType<typeof signatureSuccess>;
export type SignatureFailure = ReturnType<typeof signatureFailure>;
export type SignatureResponse = SignatureSuccess | SignatureFailure;


// WITHDRAWAL
// ==========

export const WITHDRAWAL_SUCCESS = 'WALLET.WITHDRAWAL.SUCCESS';
export const WITHDRAWAL_FAILURE = 'WALLET.WITHDRAWAL.FAILURE';

export const withdrawalSuccess = transaction => ({
  type: WITHDRAWAL_SUCCESS as typeof WITHDRAWAL_SUCCESS,
  transaction,
});
export const withdrawalFailure = (reason) => ({
  type: WITHDRAWAL_FAILURE as typeof WITHDRAWAL_FAILURE,
  reason,
});

export type WithdrawalSuccess = ReturnType<typeof withdrawalSuccess>;
export type WithdrawalFailure = ReturnType<typeof withdrawalFailure>;
export type WithdrawalResponse = WithdrawalSuccess | WithdrawalFailure;


// INITIALIZATION
// ==============

export const INITIALIZATION_SUCCESS = 'WALLET.INITIALIZATION.SUCCESS';
export const INITIALIZATION_FAILURE = 'WALLET.INITIALIZATION.FAILURE';

export const initializationSuccess = address => ({
  type: INITIALIZATION_SUCCESS as typeof INITIALIZATION_SUCCESS,
  address,
});

export const initializationFailure = (message: string) => ({
  type: INITIALIZATION_FAILURE as typeof INITIALIZATION_FAILURE,
  message,
});

export type InitializationSuccess = ReturnType<typeof initializationSuccess>;

// CONCLUDE
// ==============

export const CONCLUDE_SUCCESS = 'WALLET.CONCLUDE.SUCCESS';
export const CONCLUDE_FAILURE = 'WALLET.CONCLUDE.FAILURE';

export const concludeSuccess = address => ({
  type: CONCLUDE_SUCCESS as typeof CONCLUDE_SUCCESS,
  address,
});

export const concludeFailure = (message: string) => ({
  type: CONCLUDE_FAILURE as typeof CONCLUDE_FAILURE,
  message,
});

export type ConcludeSuccess = ReturnType<typeof concludeSuccess>;


// MESSAGING
// =========
export const SEND_MESSAGE = 'WALLET.MESSAGING.SEND';

export const sendMessage = (to: string, data: string, signature: string) => ({
  type: SEND_MESSAGE as typeof SEND_MESSAGE,
  to,
  data,
  signature,
});

export type SendMessage = ReturnType<typeof sendMessage>;

export const MESSAGE_RECEIVED = 'WALLET.MESSAGING.MESSAGE_RECEIVED';
export const messageReceived = (positionData: string, signature: string) => ({
  type: MESSAGE_RECEIVED as typeof MESSAGE_RECEIVED,
  positionData,
  signature,
});


export type MessageReceived = ReturnType<typeof messageReceived>;

export type ResponseAction =
  InitializationSuccess |
  ConcludeSuccess |
  ValidationSuccess |
  FundingSuccess |
  FundingFailure |
  SignatureSuccess |
  SendMessage;