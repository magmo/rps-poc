import { connect } from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import * as actions from '../redux/game/actions';
import * as loginActions from '../redux/login/actions';
import * as globalActions from 'src/redux/global/actions';

import { SiteState } from '../redux/reducer';

const mapStateToProps = (state: SiteState) => ({
  showRules: state.rules.visible,
});

const mapDispatchToProps = {
  newOpenGame: actions.newOpenGame,
  logoutRequest: loginActions.logoutRequest,
  rulesRequest: globalActions.toggleVisibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationBar);
