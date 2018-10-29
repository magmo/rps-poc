import React from "react";
import { Button } from 'reactstrap';
import MAGMO_LOGO from '../images/magmo_logo.svg';


interface Props {
  createBlockchainChallenge: () => void;
  resign: () => void;
}

export default class GameFooter extends React.PureComponent<Props> {
  render() {
    const { resign, createBlockchainChallenge } = this.props;
    return (
      <footer className="footer">
        <div className="container">
            <Button className="footer-resign" outline={true} onClick={resign}>
              Resign
            </Button>
            <Button className="footer-challenge" outline={true} onClick={createBlockchainChallenge}>
              Challenge on-chain
            </Button>
          <div className="float-right">
            <img src={MAGMO_LOGO} />
          </div>
        </div>
      </footer>
    );
  }
}
