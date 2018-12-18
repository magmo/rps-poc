import React from 'react';
import Button from 'reactstrap/lib/Button';
import SidebarLayout from '../SidebarLayout';


interface Props {
  expiryTime: number;
  selectRespondWithMove: () => void;
}

export default class ChooseResponse extends React.PureComponent<Props> {

  render() {
    const { expiryTime, selectRespondWithMove } = this.props;
    // TODO: We should add hover text or an icon to these options to fully explain what they mean to the user.
    return (
      <SidebarLayout>
        <div className="challenge-expired-title">
          A challenge has been issued!
      </div>
        <p>
          The other player has challenged you and you need to respond by {expiryTime} or the game will conclude!
          Select how you would like to respond:
      </p>
        <div className="challenge-expired-button-container" >
          <Button className="challenge-expired-button" onClick={selectRespondWithMove} >
            Respond with Move
        </Button>
        </div>
      </SidebarLayout>
    );
  }
}
