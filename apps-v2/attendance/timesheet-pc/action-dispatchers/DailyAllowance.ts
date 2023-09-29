import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import Repository from '@attendance/repositories/AttDailyAllowanceRecordRepository';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { User } from '../../../domain/models/User';

import { actions as dailyAllowanceEntitiesActions } from '../modules/entities/dailyAllowance';
import { actions as dailyAllowanceUiActions } from '../modules/ui/dailyAllowance';

import { CloseEvent } from '../../daily-allowance';
import { AppDispatch } from './AppThunk';

export const loadDailyAllowanceRecords =
  (timesheet: TimesheetFromRemote, empId?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(dailyAllowanceEntitiesActions.clear());
      dispatch(dailyAllowanceUiActions.startLoading());
      const dailyAllowanceSummary = await Repository.search({
        empId,
        startDate: timesheet.startDate,
        endDate: timesheet.endDate,
      });
      dispatch(
        dailyAllowanceEntitiesActions.fetchSuccess(
          dailyAllowanceSummary,
          timesheet
        )
      );
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(dailyAllowanceUiActions.endLoading());
    }
  };

export const loadDailyAllowanceRecordsBetweenPeriods =
  (period: { startDate: string; endDate: string }, empId?: string, onClose?) =>
  async (dispatch: AppDispatch) => {
    const AppService = bindActionCreators(
      { catchApiError, loadingStart, loadingEnd },
      dispatch
    );
    try {
      AppService.loadingStart();
      const dailyAllowanceSummary = await Repository.search({
        empId,
        ...period,
      });
      dispatch(
        dailyAllowanceEntitiesActions.updateRecords(dailyAllowanceSummary)
      );

      onClose({
        dismissed: true,
        saved: false,
        timestamp: false,
        targetDate: period.startDate,
      });
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      AppService.loadingEnd();
    }
  };
// eslint-disable-next-line import/prefer-default-export
export const closeDailyAllowance =
  (e: CloseEvent, user?: User, onClose?) => async (dispatch: AppDispatch) => {
    const AppService = bindActionCreators(
      { catchApiError, loadingStart, loadingEnd },
      dispatch
    );

    const promises = [];
    if (e.saved) {
      promises.push(
        dispatch(
          refreshTimesheet(e.targetDate, user ? user.id : undefined, onClose)
        )
      );
    }

    AppService.loadingStart();
    try {
      await Promise.all(promises);
      // eslint-disable-next-line no-shadow
    } catch (e) {
      AppService.catchApiError(e);
    } finally {
      AppService.loadingEnd();
    }
  };

const refreshTimesheet =
  (targetDate: string, targetEmployeeId?: string, onClose?) =>
  async (dispatch: AppDispatch) => {
    const empId = targetEmployeeId || undefined;
    dispatch(
      loadDailyAllowanceRecordsBetweenPeriods(
        { startDate: targetDate, endDate: targetDate },
        empId,
        onClose
      )
    );
  };
