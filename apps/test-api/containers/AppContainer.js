/* @flow */
import { connect } from 'react-redux';

import { execute } from '../action-dispatchers/app';

import App from '../components';

const mapStateToProps = (state) => ({
  response: state.response,
});

const mapDispatchToProps = {
  executeAPI: execute,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(App): React.ComponentType<Object>);
