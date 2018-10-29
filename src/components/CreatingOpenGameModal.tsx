import _ from 'lodash';
import React from 'react';

import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import web3Utils from 'web3-utils';

interface Props {
  visible: boolean;
  createOpenGame: (roundBuyIn: string) => void;
  cancelOpenGame: () => void;
}
interface State {
  validBuyIn: boolean;
  buyIn: string;
  showError: boolean;
}
const MIN_BUYIN = 0.001;
const MAX_BUYIN = 1;

export default class CreatingOpenGameModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = { validBuyIn: false, buyIn: "", showError: false };
    this.createOpenGameHandler = this.createOpenGameHandler.bind(this);
    this.handleBuyInChange = this.handleBuyInChange.bind(this);
  }
  handleBuyInChange(e) {
    const buyIn = Number(e.target.value);
    let validBuyIn = true;
    if (buyIn < MIN_BUYIN || buyIn > MAX_BUYIN) {
      validBuyIn = false;
    }
    this.setState({ validBuyIn, buyIn: e.target.value, showError: false });
  }

  createOpenGameHandler(e) {
    e.preventDefault();
    if (this.state.validBuyIn) {
      this.props.createOpenGame(web3Utils.toWei(this.state.buyIn, 'ether'));
    } else {
      this.setState({ showError: true });
    }
  }

  render() {
    return (
      <Modal className="cog-container" toggle={this.props.cancelOpenGame} isOpen={this.props.visible} centered={true}>
        <ModalHeader className="rules-header">
          Create A Game
      </ModalHeader>

        <ModalBody>
          <form className="cog-form" onSubmit={e => this.createOpenGameHandler(e)}>
            <div className="form-group">
              <label htmlFor="buyin">Enter Buy In Amount</label>
              <input
                className="form-control"
                name="buyin"
                id="buyin"
                placeholder="ETH"
                value={this.state.buyIn}
                onChange={e => this.handleBuyInChange(e)}
              />
              <small className="form-text text-muted">
                {
                  `Please enter an amount between ${MIN_BUYIN} and ${MAX_BUYIN}`
                }
              </small>
              {!this.state.validBuyIn && this.state.showError &&
                <small className="form-text text-danger">
                  {
                    this.state.buyIn === "" ? "Please enter a buy-in amount" :
                    `Invalid buy in amount ${this.state.buyIn}. Please enter an amount between ${MIN_BUYIN} and ${MAX_BUYIN}`
                  }
                </small>
              }
              <div className="mt-2">Wage Per Round:</div>
              <small className="form-text text-muted">
                This will be 20% of the total buy in amount.
            </small>
            </div>
            <Button className="cog-button" type="submit" block={true}>
              Create Game
          </Button>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}