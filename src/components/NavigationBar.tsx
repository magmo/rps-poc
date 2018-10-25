import React from "react";

import { Button, Navbar } from "reactstrap";
import { State } from "fmg-core";
import { RulesModal } from "./RulesModal";

interface Props {
  showRules: boolean;
  logoutRequest: () => void;
  rulesRequest: () => void;
}

function getInitials(loginState: LoginState): string {
  const userDisplayName = loginState.user.displayName.split(" ");
  return userDisplayName.map(name => name.charAt(0)).join("");
}

export default class NavigationBar extends React.PureComponent<Props, State> {
  render() {
    return (
      <Navbar className='navbar'>
        <Button color="link" className="navbar-button mr-auto" onClick={this.props.rulesRequest}>
          Rules
        </Button>
        <div className="circle">
          <div className="navbar-user">{getInitials(this.props.login)}</div>
        </div>
        <Button color="link" className="navbar-button ml-auto" onClick={this.props.logoutRequest}>
          Sign Out
        </Button>
        <RulesModal visible={this.props.showRules} rulesRequest={this.props.rulesRequest}/>
      </Navbar>
    );
  }
}
