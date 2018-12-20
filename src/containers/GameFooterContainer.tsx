import { connect } from 'react-redux';

import GameFooter from '../components/GameFooter';
import * as gameActions from '../redux/game/actions';
import * as walletActions from '../wallet/interface/incoming';
import { SiteState } from '../redux/reducer';
import { PlayingState } from '../redux/game/state';
import { Player } from '../core/players';

function mapStateToProps(state: SiteState) {
  const gameState = state.game.gameState as PlayingState;
  const { player, turnNum } = gameState;
  const isNotOurTurn = player === Player.PlayerA ? turnNum % 2 === 0 : turnNum % 2 !== 0;

  return {
    isNotOurTurn,
  };
}
const mapDispatchToProps = {
  resign: gameActions.resign,
  createBlockchainChallenge: walletActions.createChallenge,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameFooter);
