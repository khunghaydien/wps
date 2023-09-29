import moment from 'moment';

import * as DailyStampTimeResultActions from '../../../commons/action-dispatchers/DailyStampTimeResult';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import CalendarUtil from '../../../commons/utils/CalendarUtil';

import { AppAction, AppDispatch } from '../../action-dispatchers/AppThunk';
import TimeTrackAlert from '../../action-dispatchers/TimeTrackAlert';

import { CloseEvent } from '../../../daily-summary';

const loadAlerts =
  (targetDate: moment.Moment): AppAction<Promise<void>> =>
  async (dispatch: AppDispatch): Promise<void> => {
    const timeTrackAlert = TimeTrackAlert(dispatch);
    const period = CalendarUtil.getCalendarPeriodAsOf(targetDate.toDate());
    await timeTrackAlert.loadTimeTrackAlerts(period);
  };

// eslint-disable-next-line import/prefer-default-export
export const closeDailySummary =
  (
    plannerDefaultView: 'Daily' | 'Weekly',
    e: CloseEvent
  ): AppAction<Promise<void>> =>
  async (dispatch: AppDispatch): Promise<void> => {
    if (e.saved) {
      if (e.timestamp && e.dailyStampTimeResult) {
        await dispatch(
          DailyStampTimeResultActions.confirmToComplementInsufficientingRestTime(
            e.dailyStampTimeResult
          )
        );
      }

      dispatch(loadingStart());
      try {
        await dispatch(loadAlerts(moment(e.targetDate)));
      } catch (err) {
        dispatch(catchApiError(err, { isContinuable: true }));
      } finally {
        dispatch(loadingEnd());
      }
    }
  };
