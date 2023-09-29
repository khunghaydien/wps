import isNil from 'lodash/isNil';

import { getUserSetting } from '@apps/commons/actions/userSetting';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import AttAttendanceRequestRepository from '@attendance/repositories/AttAttendanceRequestRepository';

import {
  isTargetDateInTimesheet,
  Timesheet,
} from '@attendance/domain/models/Timesheet';

import { actions as AttendanceRequestHistoryActions } from '@mobile/modules/attendance/attendanceRequest/history';
import { actions as AttendanceRequestActions } from '@mobile/modules/attendance/attendanceRequest/request';
import { actions as EntitiesActions } from '@mobile/modules/attendance/timesheet/entities';
import { actions as UiMonthlyPagingActions } from '@mobile/modules/attendance/timesheet/ui/monthly/paging';

import { AppDispatch } from '../AppThunk';
import { loadTimesheet } from './timesheet';

const clearTimesheet = () => (dispatch: AppDispatch) => {
  dispatch(AttendanceRequestActions.clear());
  dispatch(UiMonthlyPagingActions.clear());
  dispatch(EntitiesActions.clear());
};

const setTimesheet = (timesheet: Timesheet) => (dispatch: AppDispatch) => {
  dispatch(AttendanceRequestActions.initialize(timesheet));
  dispatch(UiMonthlyPagingActions.fetchSuccess(timesheet));
  dispatch(EntitiesActions.fetchSuccess(timesheet));
};

const fetchAttendanceRequestHistories =
  (requestId?: string) => async (dispatch: AppDispatch) => {
    try {
      if (requestId) {
        const requestHistories =
          await AttAttendanceRequestRepository.fetchHistories({
            requestId,
          });
        dispatch(AttendanceRequestHistoryActions.initialize(requestHistories));
      } else {
        dispatch(AttendanceRequestHistoryActions.clear());
      }
    } catch (error) {
      dispatch(
        catchApiError(error, {
          isContinuable: false,
        })
      );
      dispatch(AttendanceRequestHistoryActions.clear());
    }
  };

const resetTimesheet =
  (targetDate?: string) =>
  async (dispatch: AppDispatch): Promise<Timesheet | null> => {
    try {
      const timesheet = await loadTimesheet(targetDate || '');
      dispatch(setTimesheet(timesheet));
      return timesheet;
    } catch (error) {
      dispatch(
        catchApiError(error, {
          isContinuable: false,
        })
      );
      dispatch(clearTimesheet());
    }
    return null;
  };

export const initialize =
  (targetDate?: string, timesheet?: Timesheet) =>
  async (dispatch: AppDispatch): Promise<Timesheet | null> => {
    dispatch(clearTimesheet());
    const loadingId = dispatch(startLoading());

    let $timesheet: Timesheet;
    try {
      dispatch(getUserSetting());
      if (!isNil(timesheet) && isTargetDateInTimesheet(timesheet, targetDate)) {
        dispatch(setTimesheet(timesheet));
        $timesheet = timesheet;
      } else {
        $timesheet = await dispatch(resetTimesheet(targetDate));
        if ($timesheet) {
          await dispatch(fetchAttendanceRequestHistories($timesheet.requestId));
        }
      }
    } finally {
      dispatch(endLoading(loadingId));
    }
    return $timesheet;
  };
