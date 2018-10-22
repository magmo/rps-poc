import { connect } from 'react-redux';

import WaitingRoomPage from '../components/WaitingRoomPage';
import * as waitingRoomActions from '../redux/waiting-room/actions';

import { SiteState } from '../redux/reducer';
import { StateName } from 'src/redux/game/state';
import BN from 'bn.js';

const mapStateToProps = (state: SiteState) => {
  let stake = new BN(0);
  if (state.game.gameState != null && state.game.gameState.name === StateName.WaitingRoom){
   stake = state.game.gameState.roundBuyIn;
  }
  return {stake}; 
};

const mapDispatchToProps = {
  cancelChallenge: waitingRoomActions.cancelChallenge,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaitingRoomPage);
