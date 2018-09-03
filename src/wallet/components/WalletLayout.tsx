import React, { ReactNode } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

interface Props {
  children: ReactNode;
}

export default class WalletLayout extends React.PureComponent<Props> {
  render() {
    return (
      <div className="container">
        <Modal isOpen={true}>
          <ModalHeader>Channel Wallet</ModalHeader>
          <ModalBody>{this.props.children}</ModalBody>
        </Modal>
      </div>
    );
  }
}
