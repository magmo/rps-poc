import React from "react";

import Navbar from "reactstrap/lib/Navbar";
import NavItem from "reactstrap/lib/NavItem";
import NavLink from "reactstrap/lib/NavLink";
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
        <NavItem className="navbar-item mr-auto">
          <NavLink className="navbar-link" href="/rules/">Rules</NavLink>
        </NavItem>
        <NavItem className="navbar-item ml-auto">
          <NavLink className="navbar-link" href="/signout/">Sign out</NavLink>
        </NavItem>
      </Navbar>
    );
  }
}
