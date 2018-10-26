import _ from 'lodash';
import React from 'react';

import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import BN from 'bn.js';
import web3Utils from 'web3-utils';
import * as gameStates from '../redux/game/state';

interface Props {
  gameState: gameStates.GameState;
  createOpenGame: (roundBuyIn: BN) => void;
  cancelOpenGame: () => void;
}

export default class CreatingOpenGameModal extends React.PureComponent<Props> {
  buyinInput: any;

  constructor(props) {
    super(props);
    this.buyinInput = React.createRef();
    this.createOpenGameHandler = this.createOpenGameHandler.bind(this);
  }

  createOpenGameHandler(e) {
    e.preventDefault();
    const buyin = Number(this.buyinInput.current.value);

    // TODO: disable button when input is empty
    if (!buyin || Number.isNaN(buyin)) {
      return;
    }

    this.props.createOpenGame(new BN(web3Utils.toWei(buyin.toString(), 'ether')));
    this.buyinInput.current.value = '';
  }

  render() {
    const visible = (this.props.gameState.name === gameStates.StateName.CreatingOpenGame);

    return (
      <Modal className="cog-container" toggle={this.props.cancelOpenGame} isOpen={visible} centered={true}>
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
              ref={this.buyinInput}
            />
            <small className="form-text text-muted">
              Enter an amount between 1 and 0.001
            </small>
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
