import { connect } from 'react-redux';

import { proposeGame, chooseAPlay } from '../redux/actions/game';
import { login, logout } from '../redux/actions/login';
import { subscribeOpponents } from '../redux/actions/opponents';
import GameController from '../components/GameController';

const mapStateToProps = state => ({
  applicationState: state.game,
  opponents: state.opponents,
  loggedIn: state.login.loggedIn,
});

const mapDispatchToProps = {
  login,
  logout,
  chooseAPlay,
  proposeGame,
  subscribeOpponents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameController);
