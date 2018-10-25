import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

interface Props {
  visible: boolean;
  rulesRequest: () => void;
}

export const RulesModal = (props: Props) => {
  return (
    <Modal isOpen={props.visible} toggle={props.rulesRequest}>
      <ModalHeader toggle={props.rulesRequest}>Here's the rules:</ModalHeader>
      <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
    </Modal>
  );
};