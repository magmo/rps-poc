import React from 'react';
import { PureComponent } from 'react';

import { ChallengeStatus, Signature, ConclusionProof } from '../domain';

import * as playerA from '../wallet-engine/wallet-states/PlayerA';
import * as playerB from '../wallet-engine/wallet-states/PlayerB';
import * as CommonState from '../wallet-engine/wallet-states';
import { FundingFailed, WaitForApproval, SelectWithdrawalAddress, WaitForWithdrawal, ChallengeRequested, WaitForChallengeConcludeOrExpire, Funded, ConfirmWithdrawal, } from '../wallet-engine/wallet-states';

import { WalletState } from '../redux/reducers/wallet-state';
import { ChallengeState } from '../redux/reducers/challenge';

import FundingInProgress, { BlockchainStatus } from './FundingInProgress';
import FundingError from './FundingError';

import ChallengeIssued from './ChallengeIssued';
import ChallengeResponse from './ChallengeResponse';
import WaitingForCreateChallenge from './WaitingForCreateChallenge';
import WaitingForConcludeChallenge from './WaitingForConcludeChallenge';
import Sidebar from 'react-sidebar';
import WalletWelcome from './WalletWelcome';
import WithdrawInProgress from './WithdrawInProgress';

interface Props {
  showWallet: boolean;
  walletState: WalletState;
  challengeState: ChallengeState;
  loginDisplayName: string;
  closeWallet: () => void;
  tryFundingAgain: () => void;
  approveFunding: () => void;
  approveWithdrawal: () => void;
  declineFunding: () => void;
  selectWithdrawalAddress: (address: string) => void;
  respondWithMove: () => void;
  respondWithAlternativeMove: (alternativePosition: string, alternativeSignature: Signature, response: string, responseSignature: Signature) => void;
  refute: (newerPosition: string, signature: Signature) => void;
  conclude: (proof: ConclusionProof) => void;
}

export default class WalletController extends PureComponent<Props> {
  renderWallet() {
    const { walletState, challengeState, loginDisplayName, closeWallet, approveWithdrawal } = this.props;
    if (walletState === null) {
      return <div />;
    }

    if (challengeState != null) {
      switch (challengeState.status) {
        case ChallengeStatus.WaitingForUserSelection:
          return (<ChallengeResponse expiryTime={challengeState.expirationTime} responseOptions={challengeState.responseOptions} respondWithMove={this.props.respondWithMove} respondWithAlternativeMove={this.props.respondWithAlternativeMove} refute={this.props.refute} conclude={this.props.conclude} />);
        case ChallengeStatus.WaitingOnOtherPlayer:
          return (<ChallengeIssued expiryTime={challengeState.expirationTime} />);
        case ChallengeStatus.WaitingForCreateChallenge:
          return <WaitingForCreateChallenge />;
        case ChallengeStatus.WaitingForCreateChallenge:
          return <WaitingForCreateChallenge />;
        case ChallengeStatus.WaitingForConcludeChallenge:
          return <WaitingForConcludeChallenge />;
      }
    }

    switch (walletState && walletState.constructor) {
      case FundingFailed:
        // TODO: Figure out why we have to do this
        if (walletState instanceof FundingFailed) {
          return (
            <FundingError
              message={(walletState as FundingFailed).message}
              tryAgain={this.props.tryFundingAgain}
            />
          );
        }
        break;
      case WaitForWithdrawal:
        return <WithdrawInProgress
          loginDisplayName={loginDisplayName}
          withdrawStatus={BlockchainStatus.NotStarted}
          amount={(walletState as CommonState.SelectWithdrawalAddress).withdrawalAmount}
        />;
        break;
      case SelectWithdrawalAddress:
        return <WithdrawInProgress
          loginDisplayName={loginDisplayName}
          withdrawStatus={BlockchainStatus.NotStarted}
          amount={(walletState as CommonState.SelectWithdrawalAddress).withdrawalAmount}
        />;
        break;
      case ConfirmWithdrawal:
        const withdrawalContent = <div><p>This State Stash wallet enables you to quickly withdraw your funds.</p>
          <p>We’ll guide you through a few simple steps to get it setup and your ETH transferred.</p></div>;
        return <WalletWelcome
          title="Withdraw with the State Stash Wallet"
          content={withdrawalContent}
          approve={approveWithdrawal}
        />;
        break;
      case ChallengeRequested:
        return <div>Waiting for challenge</div>;
      case WaitForChallengeConcludeOrExpire:
        return <div>Waiting for opponent to respond to challenge</div>;
      case playerA.ReadyToDeploy:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.NotStarted}
          depositStatus={BlockchainStatus.NotStarted}
          player={0}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;
        break;
      case playerA.Funded:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.Completed}
          depositStatus={BlockchainStatus.Completed}
          player={0}
          amount={(walletState as Funded).myBalance}
          returnToGame={closeWallet}
        />;
        break;
      case playerB.Funded:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.Completed}
          depositStatus={BlockchainStatus.Completed}
          player={1}
          amount={(walletState as Funded).myBalance}
          returnToGame={closeWallet}

        />;
      case playerA.WaitForBlockchainDeploy:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.InProgress}
          depositStatus={BlockchainStatus.NotStarted}
          player={0}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;

      case playerA.WaitForBToDeposit:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.Completed}
          depositStatus={BlockchainStatus.NotStarted}
          player={0}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;

      case playerB.WaitForAToDeploy:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.NotStarted}
          depositStatus={BlockchainStatus.NotStarted}
          player={1}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;

      case playerB.ReadyToDeposit:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.Completed}
          depositStatus={BlockchainStatus.NotStarted}
          player={1}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;

      case playerB.WaitForBlockchainDeposit:
        return <FundingInProgress
          loginDisplayName={loginDisplayName}
          deployStatus={BlockchainStatus.Completed}
          depositStatus={BlockchainStatus.InProgress}
          player={1}
          amount={(walletState as playerA.WaitForBlockchainDeploy).myBalance}
        />;
      case WaitForApproval:
      case playerB.WaitForApprovalWithAdjudicator:
        const fundingContent = <div><p>This wallet enables you to quickly transfer to funds to buy in and withdraw from games.</p>
          <p>We’ll guide you through a few simple steps to get it setup and your ETH transferred.</p></div>;
        return <WalletWelcome title="Transfer Funds with this State Stash Wallet"
          content={fundingContent}
          approve={this.props.approveFunding}
          decline={this.props.declineFunding} />;
      default:
        return <div />;
    }
    return <div />;
  }

  render() {
    return <Sidebar
      sidebar={this.renderWallet()}
      open={this.props.showWallet}
      styles={{ sidebar: { width: "30%", background: "#f3f3f3" } }}
    >
      {this.props.children}
    </Sidebar>;
  }
}
