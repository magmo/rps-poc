import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as states from '../states';
import { SiteState } from '../../redux/reducer';
import FullContainer from './Full';
import SidebarLayout from '../components/SidebarLayout';
import FooterLayout from './WalletFooter';

interface WalletProps {
  state: states.WalletState;
}

class Wallet extends PureComponent<WalletProps> {

  render() {
    const { state, children } = this.props;

    switch (state.stage) {
      case states.FUNDING:
        if (state.type === states.WAIT_FOR_FUNDING_REQUEST) {
          return hideWallet(state, children);
        } else {
          return showWallet(state, children);
        }
      case states.CHALLENGING:
      case states.WITHDRAWING:
        return showWallet(state, children);
      case states.RESPONDING:
        if (state.type === states.TAKE_MOVE_IN_APP) {
          return showFooter(state, children);
        } else {
          return showWallet(state, children);
        }
      case states.CLOSING:
        // todo: figure out what the workflow here should be
      default:
        return hideWallet(state, children);
    }
  }
}

function showWallet(state, children) {
  return (
    <SidebarLayout contents={<FullContainer state={state} />}>
      {children}
    </SidebarLayout>
  );
}

function showFooter(state, children) {
  return (
    <FooterLayout>
      {children}
    </FooterLayout>
  );
}

function hideWallet(state, children) {
  return children;
}


const mapStateToProps = (state: SiteState): WalletProps => ({
  state: state.wallet,
});

export default connect(mapStateToProps)(Wallet);
