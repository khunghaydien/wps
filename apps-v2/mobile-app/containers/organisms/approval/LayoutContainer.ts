import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { getUserSetting } from '../../../../commons/actions/userSetting';

import Layout, { Props } from '../../../components/organisms/approval/Layout';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    isShowingBody: !!(state.userSetting && state.userSetting.companyId),
    loading: state.mobileCommons.loading,
  };
};

const mapDispatchToProps = (_dispatch: Dispatch<any>) => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: Dispatch<any>, props) => {
      if (!props.isShowingBody) {
        dispatch(getUserSetting());
      }
    },
  })
)(Layout as React.ComponentType<Props>);
