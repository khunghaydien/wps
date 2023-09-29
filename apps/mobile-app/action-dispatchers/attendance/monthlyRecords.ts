import isNil from 'lodash/isNil';

import { getUserSetting } from '../../../commons/actions/userSetting';
import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import {
  isTargetDateInTimesheet,
  Timesheet,
} from '../../../domain/models/attendance/Timesheet';

import { actions as EntitiesActions } from '../../modules/attendance/timesheet/entities';
import { actions as UiMonthlyPagingActions } from '../../modules/attendance/timesheet/ui/monthly/paging';

import { AppDispatch } from '../AppThunk';
import { loadTimesheet } from './timesheet';

const clearTimesheet = () => (dispatch: AppDispatch) => {
  dispatch(UiMonthlyPagingActions.clear());
  dispatch(EntitiesActions.clear());
};

const setTimesheet = (timesheet: Timesheet) => (dispatch: AppDispatch) => {
  dispatch(UiMonthlyPagingActions.fetchSuccess(timesheet));
  dispatch(EntitiesActions.fetchSuccess(timesheet));
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

    const [_, $timesheet] = await dispatch(
      withLoading(
        (_dispatch: AppDispatch) => _dispatch(getUserSetting()),
        (_dispatch: AppDispatch): any => {
          if (
            !isNil(timesheet) &&
            isTargetDateInTimesheet(timesheet, targetDate)
          ) {
            _dispatch(setTimesheet(timesheet));
            return timesheet;
          } else {
            return _dispatch(resetTimesheet(targetDate));
          }
        }
      )
    );
    return $timesheet;
  };
