import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { getUserSetting } from '../../../../commons/actions/userSetting';
import { withLoading } from '../../../modules/commons/loading';

const Identity = ({ children }) => {
  return children;
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default (props: { [key: string]: any }) => {
  const ComposedComponent = compose(
    connect(
      (state: { [key: string]: any }) => state,
      (_dispatch: any) => ({}),
      mergeProps
    ),
    lifecycle({
      componentDidMount: (dispatch: Dispatch<any>, _props) => {
        dispatch(withLoading(getUserSetting()));
      },
    })
  )(Identity) as React.ComponentType<{
    [key: string]: any;
  }>;

  const MemoizedComponent = React.useMemo(
    () => () => <ComposedComponent {...props} />,
    [props]
  );

  return <MemoizedComponent />;
};
