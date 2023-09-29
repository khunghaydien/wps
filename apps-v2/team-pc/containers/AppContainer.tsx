import { connect } from 'react-redux';

import { State } from '../modules';

import App from '../components/App';

const mapStateToProps = (state: State): State => state;

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
