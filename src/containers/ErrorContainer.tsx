import { connect } from 'react-redux';

import ErrorPage from '../components/ErrorPage';

const mapStateToProps = (error: string) => ({
  error,
});

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorPage);
