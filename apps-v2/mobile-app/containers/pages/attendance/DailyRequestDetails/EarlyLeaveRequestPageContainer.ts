import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import {
  catchApiError,
  catchBusinessError,
} from '../../../../modules/commons/error';
import { withLoading } from '../../../../modules/commons/loading';

import EarlyLeaveReasonRepository from '@attendance/repositories/EarlyLeaveReasonRepository';

import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import {
  convertForEditing as convertEarlyLeaveRequestForEditing,
  create as createEarlyLeaveRequest,
} from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/earlyLeaveRequest';
import { earlyLeaveReasonOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';
import { State as TimesheetState } from '../../../../modules/attendance/timesheet/entities';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/EarlyLeaveRequestPage';

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
    isLeavingOffice: record && record.endTime !== null,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    record,
    request:
      state.attendance.dailyRequest.ui.requests.earlyLeaveRequest.request,
    validation: state.attendance.dailyRequest.ui.validation,
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.EarlyLeave),
    isFlexWithoutCoreNoWorkingTime:
      record &&
      record.isFlexWithoutCore &&
      (record.startTime === null || record.endTime === null),
    isFlexWithoutCore: record && record.isFlexWithoutCore,
    personalReasonEarlyLeaveEndTime:
      record && record.personalReasonEarlyLeaveEndTime,
    objectiveReasonEarlyLeaveEndTime:
      record && record.objectiveReasonEarlyLeaveEndTime,
    earlyLeaveReasonOptions: earlyLeaveReasonOptions(
      state.attendance.dailyRequest.ui.requests
    ),
    useEarlyLeaveReason:
      state.attendance.dailyRequest.ui.requests.earlyLeaveRequest
        .useEarlyLeaveReason,
    earlyLeaveReasonList:
      state.attendance.dailyRequest.ui.requests.earlyLeaveRequest
        .earlyLeaveReasonList,
    selectedEarlyLeaveReason:
      state.attendance.dailyRequest.ui.requests.earlyLeaveRequest
        .selectedEarlyLeaveReason,
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
  onChangeStartTime: (val: number | null) => {
    dispatchProps.updateHandler('startTime', val);
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
      const { originalRequest, record, targetDate, workingType } = props;
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
            const earlyLeaveReasons =
              await EarlyLeaveReasonRepository.fetchList({ targetDate });
            const request = convertEarlyLeaveRequestForEditing(
              createEarlyLeaveRequest(originalRequest, targetDate),
              {
                dailyRecord: record,
                earlyLeaveReasons,
                useEarlyLeaveReason: workingType.useEarlyLeaveReason,
              }
            );
            dispatch(actions.initialize(request));
            dispatch(
              requestActions.setUpForEditing(
                request,
                record,
                earlyLeaveReasons,
                workingType.useEarlyLeaveReason
              )
            );
          } catch (err) {
            appService.catchApiError(err);
          }
        });
      } else {
        const request = createEarlyLeaveRequest(originalRequest, targetDate);
        dispatch(actions.initialize(request));
        dispatch(requestActions.initialize(request));
      }
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
