import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { WalletState, DisplayMode } from '../states/wallet';
import { SiteState } from '../../redux/reducer';
import WalletContents from './WalletContents';
import SidebarLayout from '../components/SidebarLayout';
import FooterLayout from './WalletFooter';

interface WalletProps {
  state: WalletState;
}

class Wallet extends PureComponent<WalletProps> {

  render() {
    const display = this.props.state.display;

    switch (display) {
      case DisplayMode.Full:
        return (
          <SidebarLayout contents={<WalletContents />}>
            {this.props.children}
          </SidebarLayout>
        );
      case DisplayMode.Minimized:
        return (
          <FooterLayout>
            {this.props.children}
          </FooterLayout>
        );
      case DisplayMode.None:
        return this.props.children;
    }
  }
}

const mapStateToProps = (state: SiteState): WalletProps => ({
  state: state.wallet,
});

export default connect(mapStateToProps)(Wallet);
