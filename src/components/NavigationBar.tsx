import React from "react";

import { Button, Navbar } from "reactstrap";
import { State } from "fmg-core";
import { LoginState } from "src/redux/login/reducer";

interface Props {
  login: LoginState;
  logoutRequest: () => void;
}

export default class NavigationBar extends React.PureComponent<Props, State> {
  render() {
    return (
      <Navbar className='navbar'>
        <Button color="link" className="navbar-button mr-auto">
          Rules
        </Button>
        <div className="circle"/>
        <Button color="link" className="navbar-button ml-auto" onClick={this.props.logoutRequest}>
          Sign Out
        </Button>
      </Navbar>
    );
  }
}
