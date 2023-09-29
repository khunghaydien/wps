import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import {
  catchApiError,
  catchBusinessError,
} from '../../../../modules/commons/error';
import { withLoading } from '../../../../modules/commons/loading';

import LateArrivalReasonRepository from '@attendance/repositories/LateArrivalReasonRepository';

import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { create as createLateArrivalRequest } from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/lateArrivalRequest';
import { lateArrivalReasonOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';
import { State as TimesheetState } from '../../../../modules/attendance/timesheet/entities';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LateArrivalRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const record =
    state.attendance.timesheet.entities.recordsByRecordDate[
      ownProps.targetDate
    ];
  return {
    ...ownProps,
    isBeforeWorking: !record || record.startTime === null,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    record,
    request:
      state.attendance.dailyRequest.ui.requests.lateArrivalRequest.request,
    validation: state.attendance.dailyRequest.ui.validation,
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.LateArrival),
    lateArrivalReasonOptions: lateArrivalReasonOptions(
      state.attendance.dailyRequest.ui.requests
    ),
    useLateArrivalReason:
      state.attendance.dailyRequest.ui.requests.lateArrivalRequest
        .useLateArrivalReason,
    lateArrivalReasonList:
      state.attendance.dailyRequest.ui.requests.lateArrivalRequest
        .lateArrivalReasonList,
    workingType: RecordsUtil.getWithinRange(
      ownProps.targetDate,
      state.attendance.timesheet.entities
        .workingTypes as TimesheetState['workingTypes']
    ),
  };
};

const mapDispatchToProps = {
  updateHandler: requestActions.update,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps
) => ({
  ...stateProps,
  onChangeEndTime: (val: number | null) => {
    dispatchProps.updateHandler('endTime', val);
  },
  onChangeReason: (val: string) => {
    dispatchProps.updateHandler('reason', val);
  },
  onChangeReasonId: (val: string) => {
    dispatchProps.updateHandler('reasonId', val);
  },
  onChangeRemarks: (val: string) => {
    dispatchProps.updateHandler('remarks', val);
  },
  onChangePersonalReason: (val: boolean) => {
    dispatchProps.updateHandler('personalReason', val);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: ReturnType<typeof mergeProps>
    ) => {
      const {
        originalRequest,
        record,
        targetDate,
        lateArrivalReasonList,
        workingType,
      } = props;
      if (!originalRequest) {
        return;
      }
      const appService = bindActionCreators(
        {
          withLoading,
          catchBusinessError,
          catchApiError,
        },
        dispatch
      );
      if (originalRequest.status === STATUS.NOT_REQUESTED) {
        appService.withLoading(async () => {
          try {
            const lateArrivalReasons =
              await LateArrivalReasonRepository.fetchList({ targetDate });
            const request = createLateArrivalRequest(
              originalRequest,
              record,
              targetDate,
              lateArrivalReasons,
              workingType.useLateArrivalReason
            );
            dispatch(actions.initialize(request));
            dispatch(
              requestActions.setLateArrivalReason(
                workingType.useLateArrivalReason
              )
            );
            dispatch(
              requestActions.initialize(request, null, lateArrivalReasons)
            );
          } catch (err) {
            appService.catchApiError(err);
          }
        });
      } else {
        const request = createLateArrivalRequest(
          originalRequest,
          null,
          targetDate,
          lateArrivalReasonList
        );
        dispatch(actions.initialize(request));
        dispatch(
          requestActions.setLateArrivalReason(workingType.useLateArrivalReason)
        );
        dispatch(requestActions.initialize(request));
      }
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
