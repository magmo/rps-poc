import { drizzleConnect } from 'drizzle-react';

import HomePage from '../components/HomePage';
import { LoginAction } from '../redux/actions/login';

const mapStateToProps = (state) => ({
  loggedIn: state.login.loggedIn,
});

const mapDispatchToProps = {
  login: LoginAction.login,
  logout: LoginAction.logout,
};

export default drizzleConnect(
  HomePage,
  mapStateToProps,
  mapDispatchToProps,
)
