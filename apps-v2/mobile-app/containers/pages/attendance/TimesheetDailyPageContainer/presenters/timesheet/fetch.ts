import { Store } from 'redux';

import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { Timesheet } from '@attendance/domain/models/Timesheet';

import { actions as EntitiesActions } from '@mobile/modules/attendance/timesheet/entities';
import { actions as UiDailyEditingActions } from '@mobile/modules/attendance/timesheet/ui/daily/editing';
import { actions as UiDailyPagingActions } from '@mobile/modules/attendance/timesheet/ui/daily/paging';
import * as UiDailyRestReasonsActions from '@mobile/modules/attendance/timesheet/ui/daily/restReasons';

import Events from '@mobile/containers/pages/attendance/TimesheetDailyPageContainer/events';

import { IPresenter } from '@attendance/application/useCaseInteractors/timesheet/FetchEntityUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/timesheet/IFetchEntityUseCase';

/**
 * complete の処理そのまま
 * Cache を使用する場合があるので export している。
 */
export const setTimesheet =
  (targetDate: string, timesheet: Timesheet) => (dispatch: AppDispatch) => {
    dispatch(UiDailyEditingActions.fetchSuccess(targetDate, timesheet));
    dispatch(UiDailyPagingActions.fetchSuccess(targetDate, timesheet));
    dispatch(EntitiesActions.fetchSuccess(timesheet));
    Events.fetched.publish();
  };

/**
 * 勤務表のデータを削除する
 */
export const clearTimesheet =
  (targetDate?: string) => (dispatch: AppDispatch) => {
    dispatch(UiDailyPagingActions.clear());
    dispatch(UiDailyEditingActions.clear());
    dispatch(UiDailyRestReasonsActions.clear());
    dispatch(EntitiesActions.clear());
    if (targetDate) {
      dispatch(UiDailyPagingActions.setCurrent(targetDate));
    }
  };

export default (store: Store) =>
  (inputData: IInputData): IPresenter => {
    const { targetDate } = inputData || {};
    let loadingId;
    const dispatch = store.dispatch as AppDispatch;
    return {
      start: () => {
        loadingId = dispatch(startLoading());
      },
      complete: ({ timesheet }) => {
        dispatch(setTimesheet(targetDate, timesheet));
      },
      error: (error) => {
        dispatch(
          catchApiError(error as Parameters<typeof catchApiError>[0], {
            isContinuable: true,
          })
        );
        dispatch(clearTimesheet(targetDate));
      },
      finally: () => {
        dispatch(endLoading(loadingId));
      },
    };
  };
