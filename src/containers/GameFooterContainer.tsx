import { connect } from 'react-redux';

import GameFooter from '../components/GameFooter';
import * as gameActions from '../redux/game/actions';
import * as walletActions from '../wallet/interface/incoming';

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {
  resign: gameActions.resign,
  createBlockchainChallenge: walletActions.createChallenge,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameFooter);
