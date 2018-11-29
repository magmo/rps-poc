import * as states from '../../states';
import * as actions from '../actions';
import { unreachable } from '../../utils';

export const withdrawingReducer = (state: states.WithdrawingState, action: actions.WalletAction): states.WalletState => {
  switch (state.type) {
    case states.APPROVE_WITHDRAWAL:
      return approveWithdrawalReducer(state, action);
    case states.INITIATE_WITHDRAWAL:
      return initiateWithdrawalReducer(state, action);
    case states.WAIT_FOR_WITHDRAWAL_CONFIRMATION:
      return waitForWithdrawalConfirmationReducer(state, action);
    case states.ACKNOWLEDGE_WITHDRAWAL_SUCCESS:
      return acknowledgeWithdrawalSuccessReducer(state, action);
    default:
      return unreachable(state);
  }
};

const approveWithdrawalReducer = (state: states.ApproveWithdrawal, action: actions.WalletAction): states.WalletState => {
  switch (action.type) {
    case actions.WITHDRAWAL_APPROVED:
      // todo: construct withdrawal

      return states.initiateWithdrawal(state);
    case actions.WITHDRAWAL_REJECTED:
      return states.closed(state);
    default:
      return state;
  }
};

const initiateWithdrawalReducer = (state: states.InitiateWithdrawal, action: actions.WalletAction): states.WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_SUBMITTED:
      return states.waitForWithdrawalConfirmation(state);
    default:
      return state;
  }
};

const waitForWithdrawalConfirmationReducer = (state: states.WaitForWithdrawalConfirmation, action: actions.WalletAction): states.WalletState => {
  switch (action.type) {
    case actions.TRANSACTION_CONFIRMED:
      return states.acknowledgeWithdrawalSuccess(state);
    default:
      return state;
  }
};

const acknowledgeWithdrawalSuccessReducer = (state: states.AcknowledgeWithdrawalSuccess, action: actions.WalletAction): states.WalletState => {
  switch (action.type) {
    case actions.WITHDRAWAL_SUCCESS_ACKNOWLEGED:
      return states.waitForChannel(state);
    default:
      return state;
  }
};
