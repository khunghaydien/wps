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

import Repository from '@attendance/repositories/LeaveRepository';

import {
  AttDailyRequest,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/leaveRequest';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LeaveRequestPage';

import FactoryForReadOnly from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/ForReadOnly';
import createLeaveRequestFactoryNewRequest from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/NewRequest';

const FactoryNewRequest = createLeaveRequestFactoryNewRequest({
  LeaveRepository: Repository,
});

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

      if (request.status === STATUS.NOT_REQUESTED) {
        const initialize = async () => {
          try {
            const leave = await FactoryNewRequest({
              targetDate: props.ownProps.targetDate,
            }).create(request as LeaveRequest);

            if (leave.leaves.size === 0) {
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

            dailyRequestService.initialize(leave);
            requestService.initialize(leave);
          } catch (e) {
            appService.catchApiError(e);
          }
        };

        dispatch(withLoading(initialize));
      } else {
        const leave = FactoryForReadOnly().create(request as LeaveRequest);
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
