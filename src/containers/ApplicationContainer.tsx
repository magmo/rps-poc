import React from 'react';
import { connect } from 'react-redux';

import { SiteState } from '../redux/reducer';
import GameContainer from './GameContainer';
import WaitingRoomContainer from './WaitingRoomContainer';
import LobbyContainer from './LobbyContainer';
import * as gameStates from '../redux/game/state';
import ErrorContainer from './ErrorContainer';

interface ApplicationProps {
  gameState?: gameStates.GameState;
}

function Application(props: ApplicationProps) {
  if (props.gameState==null){
    return <ErrorContainer/>;
  }

  switch (props.gameState.name) {
    case gameStates.StateName.WaitingRoom:
      return <WaitingRoomContainer />;
    case gameStates.StateName.Lobby:
      return <LobbyContainer />;
    default:
      return <GameContainer />;
  }
}

const mapStateToProps = (state: SiteState): ApplicationProps => ({
  gameState: state.game.gameState ,
});

export default connect(mapStateToProps)(Application);
