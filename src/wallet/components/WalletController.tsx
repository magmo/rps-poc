import * as playerA from '../wallet-engine/wallet-states/PlayerA';
import * as playerB from '../wallet-engine/wallet-states/PlayerB';
import { WalletState } from '../redux/reducers/wallet-state';
import { PureComponent } from 'react';
import WalletLayout from './WalletLayout';
import FundingInProgress from './FundingInProgress';
import React from 'react';

interface Props {
  walletState: WalletState;
}

export default class WalletController extends PureComponent<Props> {
  render() {
    const { walletState } = this.props;
    if (walletState==null){
        return null;
    }
    switch (walletState && walletState.constructor) {
      case playerA.WaitForBlockchainDeploy:
        return (
          <WalletLayout>
            <FundingInProgress message="confirmation of adjudicator deployment" />;
          </WalletLayout>
        )

      case playerA.WaitForBToDeposit:
        return (
          <WalletLayout>
            <FundingInProgress message="confirmation of adjudicator deployment" />;
          </WalletLayout>
        )

      case playerB.WaitForAToDeploy:
        return (
          <WalletLayout>
            <FundingInProgress message="waiting for adjudicator to be deployed" />;
          </WalletLayout>
        )

      case playerB.ReadyToDeposit:
        return (
          <WalletLayout>
            <FundingInProgress message="ready to deposit funds" />;
          </WalletLayout>
        )

      case playerB.WaitForBlockchainDeposit:
        return (
          <WalletLayout>
            <FundingInProgress message="waiting for deposit confirmation" />;
          </WalletLayout>
        )

      default:
        return (
          <WalletLayout>
            <FundingInProgress message={`[view not implemented: ${walletState.constructor.name}`} />;
          </WalletLayout>
        )
    }
  }
}
