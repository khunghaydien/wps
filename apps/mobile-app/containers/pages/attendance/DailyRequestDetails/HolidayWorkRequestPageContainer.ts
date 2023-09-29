import { connect } from 'react-redux';
import { compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import { create as createHolidayWorkRequest } from '../../../../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';
import { create as createSubstituteLeaveType } from '../../../../../domain/models/attendance/SubstituteLeaveType';
import { getAttDailyRecordByDate } from '../../../../../domain/models/attendance/Timesheet';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/holidayWorkRequest';
import { substituteLeaveTypeOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/HolidayWorkRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    request:
      state.attendance.dailyRequest.ui.requests.holidayWorkRequest.request,
    substituteLeaveTypeList:
      state.attendance.dailyRequest.ui.requests.holidayWorkRequest
        .substituteLeaveTypeList,
    timesheet: state.attendance.timesheet.entities,
    typeOptions: substituteLeaveTypeOptions(
      state.attendance.dailyRequest.ui.requests
    ),
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.HolidayWork),
    validation: state.attendance.dailyRequest.ui.validation,
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
  onChangeStartDate: (val: string) => {
    dispatchProps.updateHandler('startDate', val);
  },
  onChangeStartTime: (val: number | null) => {
    dispatchProps.updateHandler('startTime', val);
  },
  onChangeEndTime: (_: number | null, val: number | null) => {
    dispatchProps.updateHandler('endTime', val);
  },
  onChangeSubstituteLeaveType: (val: string) => {
    dispatchProps.updateHandler('substituteLeaveType', val);
  },
  onChangeSubstituteDate: (val: string) => {
    dispatchProps.updateHandler('substituteDate', val);
  },
  onChangeRemarks: (val: string) => {
    dispatchProps.updateHandler('remarks', val);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: ReturnType<typeof mergeProps>
    ) => {
      const { originalRequest, timesheet, targetDate } = props;
      if (!originalRequest) {
        return;
      }
      const request = createHolidayWorkRequest(
        originalRequest,
        timesheet.workingType,
        targetDate
      );
      const record = getAttDailyRecordByDate(targetDate, timesheet);
      const substituteLeaveTypeList = createSubstituteLeaveType(
        request,
        timesheet.workingType,
        record ? record.dayType : null
      );
      dispatch(actions.initialize(request));
      dispatch(requestActions.initialize(request, substituteLeaveTypeList));
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
