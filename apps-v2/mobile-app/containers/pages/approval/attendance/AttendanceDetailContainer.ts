import { connect } from 'react-redux';
import { compose } from 'redux';

import lifecycle from '../../../../concerns/lifecycle';

import * as detailSelectors from '../../../../../approvals-pc/modules/entities/att/detail/selectors';
import { actions as DetailActions } from '../../../../modules/approval/ui/detail';

import { approve } from '../../../../action-dispatchers/approval/Approve';
import { getAttRequest } from '../../../../action-dispatchers/approval/AttendanceRequest';
import { reject } from '../../../../action-dispatchers/approval/Reject';
import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import AttDetailPage from '../../../../components/pages/approval/attendance/Request';

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  request: state.approval.entities.attendance.request,
  selection: state.approval.entities.list.select,
  detailList: detailSelectors.detailListSelector(
    state.approval.entities.attendance.request
  ),
  comment: state.approval.ui.detail.comment,
});

const mapDispatchToProps = {
  onChangeComment: DetailActions.setComment,
  approveHandler: approve,
  rejectHandler: reject,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickApproveButton: () => {
    dispatchProps
      .approveHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        ownProps.history.push('/approval/list');
      });
  },
  onClickRejectButton: () => {
    dispatchProps
      .rejectHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        ownProps.history.push('/approval/list');
      });
  },
  onClickBack: () => {
    ownProps.history.push(`/approval/list/type/${stateProps.selection}`);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: AppDispatch, props) => {
      dispatch(DetailActions.initialize());
      dispatch(getAttRequest(props.requestId));
    },
  })
)(AttDetailPage) as React.ComponentType<{
  [key: string]: any;
}>;
