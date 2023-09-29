import { catchApiError } from '../../../commons/actions/app';

import Repository from '../../../repositories/DailyRecordRepository';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { actions as dailyTimeTrackEntitiesActions } from '../modules/entities/dailyTimeTrack';
import { actions as dailyTimeTrackUiActions } from '../modules/ui/dailyTimeTrack';

import { AppDispatch } from './AppThunk';

export const loadDailyTimeTrackRecords =
  (timesheet: TimesheetFromRemote, empId?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(dailyTimeTrackEntitiesActions.clear());
      dispatch(dailyTimeTrackUiActions.startLoading());
      const records = await Repository.search({
        empId,
        startDate: timesheet.startDate,
        endDate: timesheet.endDate,
      });
      dispatch(dailyTimeTrackEntitiesActions.fetchSuccess(records, timesheet));
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(dailyTimeTrackUiActions.endLoading());
    }
  };

export const loadDailyTimeTrackRecordsBetweenPeriods =
  (
    period: { startDate: string; endDate: string },
    timesheet: TimesheetFromRemote,
    empId?: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(dailyTimeTrackUiActions.startLoading());
      const records = await Repository.search({
        empId,
        ...period,
      });
      dispatch(dailyTimeTrackEntitiesActions.updateRecords(records, timesheet));
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(dailyTimeTrackUiActions.endLoading());
    }
  };
