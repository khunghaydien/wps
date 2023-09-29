import { bindActionCreators } from 'redux';

import { actions as appActions } from '@commons/modules/app';
import DateUtil from '@commons/utils/DateUtil';

import { fetch } from '@apps/domain/models/time-tracking/MonthlyTrack';

import { AppDispatch } from '../modules/AppThunk';
import {
  clear as clearDailyList,
  set as setDailyList,
} from '../modules/timeTrack/dailyTrackList';
import { set as setOverview } from '../modules/timeTrack/overview';
import { set as setRequest } from '../modules/timeTrack/request';

import * as taskListActions from './taskList';

const App = (dispatch: AppDispatch) => ({
  ...bindActionCreators({ ...appActions }, dispatch),
});

export default (dispatch: AppDispatch) => {
  const app = App(dispatch);

  const loadPeriodAt = async (targetDate: string): Promise<void> => {
    const { dailyTrackList, overview, requestId } = await fetch(targetDate);
    dispatch(clearDailyList());
    dispatch(taskListActions.setSummaryTask(dailyTrackList));
    dispatch(setDailyList(dailyTrackList));
    dispatch(setOverview(overview));
    dispatch(setRequest(requestId));
  };

  return {
    loadPeriodAt,
    loadNextPeriod: async ({
      endDate,
    }: {
      startDate: string;
      endDate: string;
    }) => {
      app.loadingStart();

      try {
        const nextPeriodStartDate = DateUtil.addDays(endDate, 1);
        await loadPeriodAt(nextPeriodStartDate);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },
    loadPrevPeriod: async ({
      startDate,
    }: {
      startDate: string;
      endDate: string;
    }) => {
      app.loadingStart();

      try {
        const prevPeriodEndDate = DateUtil.addDays(startDate, -1);
        await loadPeriodAt(prevPeriodEndDate);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },
    loadCurrentPeriod: async (
      dateInCurrentPeriod: string = DateUtil.getToday()
    ) => {
      app.loadingStart();

      try {
        await loadPeriodAt(dateInCurrentPeriod);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },
  };
};
