import { connect } from 'react-redux';
import { compose } from 'redux';

import lifecycle from '@mobile/concerns/lifecycle';

import { actions as DetailActions } from '@mobile/modules/approval/ui/detail';

import { approve } from '@mobile/action-dispatchers/approval/Approve';
import { getAttendanceRequest } from '@mobile/action-dispatchers/approval/AttendanceRequest';
import { reject } from '@mobile/action-dispatchers/approval/Reject';
import { AppDispatch } from '@mobile/action-dispatchers/AppThunk';

import Component from '@mobile/components/pages/approval/attendance/AttendanceRequest';

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  request: state.approval.entities.attendance.attendanceRequest,
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
  onClickRow: (targetDate) => {
    ownProps.history.push(
      `/approval/list/select/attendance_fix/${ownProps.requestId}/${targetDate}`
    );
  },
  onClickApproveButton: () => {
    dispatchProps
      .approveHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        ownProps.history.push('/approval/list/back');
      });
  },
  onClickRejectButton: () => {
    dispatchProps
      .rejectHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        ownProps.history.push('/approval/list/back');
      });
  },
  onClickBack: () => {
    ownProps.history.push(`/approval/list/back`);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: AppDispatch, props) => {
      if (!props.request?.id || props.requestId !== props.request?.id) {
        dispatch(DetailActions.initialize());
        dispatch(getAttendanceRequest(props.requestId));
      }
    },
  })
)(Component) as React.ComponentType<{
  [key: string]: any;
}>;
