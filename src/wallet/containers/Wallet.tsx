import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as states from '../states';
import { SiteState } from '../../redux/reducer';
import FundingContainer from './Funding';
import RespondingContainer from './Responding';
import ChallengingContainer from './Challenging';
import WithdrawingContainer from './Withdrawing';

interface WalletProps {
  state: states.WalletState;
}

class Wallet extends PureComponent<WalletProps> {

  render() {
    const { state, children } = this.props;

    switch (state.stage) {
      case states.FUNDING:
        return <FundingContainer state={state} children={children} />;
      case states.CHALLENGING:
        return <ChallengingContainer state={state} children={children} />;
      case states.WITHDRAWING:
        return <WithdrawingContainer state={state} children={children} />;
      case states.RESPONDING:
        return <RespondingContainer state={state} children={children} />;
      default:
        return hideWallet(state, children);
    }
  }
}

function hideWallet(state, children) {
  return children;
}

const mapStateToProps = (state: SiteState): WalletProps => ({
  state: state.wallet,
});

export default connect(mapStateToProps)(Wallet);
