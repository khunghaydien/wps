import { bindActionCreators } from 'redux';

import { confirmToComplementInsufficientingRestTime } from '../../../commons/action-dispatchers/DailyStampTimeResult';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import { User } from '../../../domain/models/User';

import { CloseEvent } from '../../../daily-summary';
import UseCases from '../UseCases';
import { AppDispatch } from './AppThunk';
import { loadDailyTimeTrackRecordsBetweenPeriods } from './DailyTimeTrack';
import { initDailyStampTime } from './StampWidget';
import { loadTimeTrackAlerts } from './TimeTrackAlert';

const refreshTimesheet =
  (targetDate: string, targetEmployeeId?: string) =>
  async (dispatch: AppDispatch) => {
    const empId = targetEmployeeId || undefined;
    const { timesheet } = await UseCases().reloadTimesheetOnly({
      targetDate,
      employeeId: targetEmployeeId,
    });

    // Don't await loading time-tracking APIs
    Promise.all([
      dispatch(loadTimeTrackAlerts(timesheet, empId)),
      dispatch(
        loadDailyTimeTrackRecordsBetweenPeriods(
          { startDate: targetDate, endDate: targetDate },
          timesheet,
          empId
        )
      ),
    ]);
  };

// eslint-disable-next-line import/prefer-default-export
export const closeDailySummary =
  (e: CloseEvent, user?: User) => async (dispatch) => {
    const AppService = bindActionCreators(
      { catchApiError, loadingStart, loadingEnd },
      dispatch
    );

    const promises = [];
    if (e.timestamp) {
      if (e.dailyStampTimeResult) {
        await dispatch(
          confirmToComplementInsufficientingRestTime(e.dailyStampTimeResult)
        );
      }

      promises.push(dispatch(initDailyStampTime()));
    }

    if (e.saved) {
      promises.push(
        dispatch(refreshTimesheet(e.targetDate, user ? user.id : undefined))
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
