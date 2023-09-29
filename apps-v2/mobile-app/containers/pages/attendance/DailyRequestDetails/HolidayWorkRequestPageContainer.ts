import { connect } from 'react-redux';
import { compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import { catchApiError } from '../../../../modules/commons/error';
import { endLoading, startLoading } from '../../../../modules/commons/loading';

import AttPatternRepository from '@attendance/repositories/AttPatternRepository';

import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { getAttDailyRecordByDate } from '@attendance/domain/models/Timesheet';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/holidayWorkRequest';
import { substituteLeaveTypeOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';
import { State as TimesheetState } from '../../../../modules/attendance/timesheet/entities';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/HolidayWorkRequestPage';

import FactoryForReadOnly from '@attendance/domain/factories/dailyRequest/HolidayWorkRequestFactory/ForReadOnly';
import createHolidayWorkRequestFactoryNewRequest from '@attendance/domain/factories/dailyRequest/HolidayWorkRequestFactory/NewRequest';
import holidayWorkRequestPatternName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/patternName';

const FactoryNewRequest = createHolidayWorkRequestFactoryNewRequest({
  AttPatternRepository,
});

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
    timesheet: state.attendance.timesheet.entities,
    typeOptions: substituteLeaveTypeOptions(
      state.attendance.dailyRequest.ui.requests
    ),
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.HolidayWork),
    selectedPattern:
      state.attendance.dailyRequest.ui.requests.holidayWorkRequest
        .selectedPattern,
    validation: state.attendance.dailyRequest.ui.validation,
  };
};

const mapDispatchToProps = {
  onUpdateValue: requestActions.update,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount: async (
      dispatch: AppDispatch,
      props: ReturnType<typeof mapStateToProps>
    ) => {
      const { originalRequest, timesheet, targetDate } = props;
      if (!originalRequest) {
        return;
      }
      const workingType = RecordsUtil.getWithinRange(
        targetDate,
        timesheet.workingTypes as TimesheetState['workingTypes']
      );
      const record = getAttDailyRecordByDate(targetDate, timesheet);
      const dayType = record ? record.dayType : null;
      if (originalRequest.status === STATUS.NOT_REQUESTED) {
        const loading = dispatch(startLoading()) as unknown as string;
        try {
          const request = await FactoryNewRequest({
            targetDate,
            workingType,
            dayType,
            patternName: holidayWorkRequestPatternName,
          }).create(originalRequest as HolidayWorkRequest);
          dispatch(actions.initialize(request));
          dispatch(requestActions.initialize(request));
        } catch (e) {
          dispatch(catchApiError(e));
        } finally {
          dispatch(endLoading(loading));
        }
      } else {
        const request = FactoryForReadOnly({
          workingType,
          dayType,
          patternName: holidayWorkRequestPatternName,
        }).create(originalRequest as HolidayWorkRequest);
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
