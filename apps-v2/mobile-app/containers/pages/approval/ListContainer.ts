import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { actions as listActions } from '../../../modules/approval/entities/list';

import { fetchApprRequestList } from '../../../action-dispatchers/approval/List';

import ListPage from '../../../components/pages/approval/ListPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    approvalList: state.approval.entities.list.approvalList,
    userSetting: state.userSetting,
    onClickRefresh: (requestType: string) => {
      ownProps.history.push(`/approval/list/type/${requestType}`);
    },
  };
};

const mapDispatchToProps = {
  setSelect: listActions.setSelect,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickPushHisotry: (
    requestId: string,
    requestType: string,
    selection?: string
  ) => {
    dispatchProps.setSelect(selection);
    const target = requestType === 'expense' ? 'expense' : 'attendance';
    ownProps.history.push(`/approval/list/select/${target}/${requestId}`);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: Dispatch<any>, _props) => {
      dispatch(fetchApprRequestList());
    },
  })
)(ListPage) as React.ComponentType<{
  [key: string]: any;
}>;
