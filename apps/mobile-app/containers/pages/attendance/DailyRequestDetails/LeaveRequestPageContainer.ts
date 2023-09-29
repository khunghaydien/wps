import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router';
import { bindActionCreators, compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import msg from '../../../../../commons/languages';
import {
  catchApiError,
  catchBusinessError,
} from '../../../../modules/commons/error';
import { withLoading } from '../../../../modules/commons/loading';

import Repository from '../../../../../repositories/attendance/AttDailyLeaveRepository';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { AttDailyRequest } from '../../../../../domain/models/attendance/AttDailyRequest';
import { create } from '../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/leaveRequest';
import {
  leaveTypeOptions,
  rangeOptions,
} from '../../../../modules/attendance/dailyRequest/ui/requests/selector';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LeaveRequestPage';

type OwnProps = {
  id: string;
  targetDate: string;
  history: RouterHistory;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  latestRequests: state.attendance.dailyRequest.entities
    .latestRequests as AttDailyRequest[],
  availableRequests: state.attendance.dailyRequest.entities
    .availableRequests as AttDailyRequest[],
  request: state.attendance.dailyRequest.ui.requests.leaveRequest.request,
  leaveTypeOptions: leaveTypeOptions(state.attendance.dailyRequest.ui.requests),
  rangeOptions: rangeOptions(state.attendance.dailyRequest.ui.requests),
  selectedAttLeave:
    state.attendance.dailyRequest.ui.requests.leaveRequest.selectedAttLeave,
  readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
  validation: state.attendance.dailyRequest.ui.validation,
  ownProps,
});

const mapDispatchToProps = {
  onChange: requestActions.update,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: ReturnType<typeof mapStateToProps>
    ) => {
      const appService = bindActionCreators(
        { catchApiError, catchBusinessError },
        dispatch
      );
      const dailyRequestService = bindActionCreators(actions, dispatch);
      const requestService = bindActionCreators(requestActions, dispatch);

      const request = props.ownProps.id
        ? props.latestRequests.find((r) => r.id === props.ownProps.id)
        : props.availableRequests.find((r) => r.requestTypeCode === CODE.Leave);
      if (!request) {
        return;
      }

      if (request.status === STATUS.NotRequested) {
        const initialize = async () => {
          try {
            const attLeaveList = await Repository.search({
              targetDate: props.ownProps.targetDate,
            });

            if (attLeaveList.length === 0) {
              appService.catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_CannotCreateIfAttLeaveListLengthIsZero,
                null
              );
              props.ownProps.history.replace(
                `/attendance/daily-requests/${props.ownProps.targetDate}`
              );
              return;
            }

            const leave = create(
              request,
              attLeaveList,
              props.ownProps.targetDate
            );
            dailyRequestService.initialize(leave);
            requestService.initialize(leave, attLeaveList);
          } catch (e) {
            appService.catchApiError(e);
          }
        };

        dispatch(withLoading(initialize));
      } else {
        const leave = create(request, null, props.ownProps.targetDate);
        dailyRequestService.initialize(leave);
        requestService.initialize(leave);
      }
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
