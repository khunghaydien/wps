import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { State } from '@attendance/timesheet-pc/modules';
import { actions as timesheetActions } from '@attendance/timesheet-pc/modules/entities/timesheet';
import { actions as editingDailyAttTimeActions } from '@attendance/timesheet-pc/modules/ui/editingDailyAttTime';
import { actions as loadingActions } from '@attendance/timesheet-pc/modules/ui/loadingDailyObjectivelyEventLog';

import { IPresenter } from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchDailyUseCaseInteractor';

export default (
  store: Store
): {
  reload: () => IPresenter;
  reloadOneRecord: IPresenter;
} => ({
  reload: (): IPresenter => {
    let opened = false;
    return {
      start: () => {
        const { dispatch } = store;
        const state = store.getState() as State;
        if (state.ui.dailyAttTimeDialog) {
          opened = true;
          dispatch(loadingStart());
        }
        dispatch(loadingActions.start());
      },
      complete: ({ dailyObjectivelyEventLogs }) => {
        store.dispatch(
          timesheetActions.setDailyObjectivelyEventLogs(
            dailyObjectivelyEventLogs
          )
        );
      },
      error: (err) => {
        const state = store.getState() as State;
        const initialized =
          !state.entities?.timesheet?.dailyObjectivelyEventLogs;
        if (initialized) {
          // 初期化失敗の場合は後続の処理をさせないために全画面エラーにする
          store.dispatch(
            catchApiError(err as Parameters<typeof catchApiError>[0], {
              isContinuable: false,
            })
          );
        } else {
          // Reload の失敗だった場合は前回のエラーを上書きしないためにエラー表示をしていなければ表示するようにしている。
          if (!state.common.app.error) {
            store.dispatch(
              catchApiError(err as Parameters<typeof catchApiError>[0])
            );
          }
        }
      },
      finally: () => {
        const { dispatch } = store;
        if (opened) {
          dispatch(loadingEnd());
        }
        dispatch(loadingActions.finish());
      },
    };
  },
  reloadOneRecord: {
    start: () => {
      store.dispatch(loadingStart());
    },
    complete: ({ startDate, dailyObjectivelyEventLogs }) => {
      const dailyObjectivelyEventLog =
        dailyObjectivelyEventLogs && dailyObjectivelyEventLogs.length
          ? dailyObjectivelyEventLogs[0]
          : null;
      store.dispatch(
        timesheetActions.updateDailyObjectivelyEventLog({
          targetDate: startDate,
          dailyObjectivelyEventLog,
        })
      );
      store.dispatch(
        editingDailyAttTimeActions.updateDailyObjectivelyEventLog(
          dailyObjectivelyEventLog
        )
      );
    },
    error: (err) => {
      if (!(store.getState() as State).common.app.error) {
        store.dispatch(
          catchApiError(err as Parameters<typeof catchApiError>[0])
        );
      }
    },
    finally: () => {
      store.dispatch(loadingEnd());
    },
  },
});
