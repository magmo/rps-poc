import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { WalletState, DisplayMode } from '../states';
import { SiteState } from '../../redux/reducer';
import FullContainer from './Full';
import SidebarLayout from '../components/SidebarLayout';
import FooterLayout from './WalletFooter';

interface WalletProps {
  state: WalletState;
}

class Wallet extends PureComponent<WalletProps> {

  render() {
    const displayMode = this.props.state.displayMode;

    switch (displayMode) {
      case DisplayMode.Full:
        return (
          <SidebarLayout contents={<FullContainer state={this.props.state} />}>
            {this.props.children}
          </SidebarLayout>
        );
      case DisplayMode.Minimized:
        return (
          <FooterLayout>
            {this.props.children}
          </FooterLayout>
        );
      default:
        return this.props.children;
    }
  }
}

const mapStateToProps = (state: SiteState): WalletProps => ({
  state: state.wallet,
});

export default connect(mapStateToProps)(Wallet);
