import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

const withDispatch = (
  WrappedComponent: React.ComponentType<Record<string, any>>
): React.ComponentType<any> => {
  return connect(mapDispatchToProps)(WrappedComponent);
};

export default withDispatch;
