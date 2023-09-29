import msg from '@commons/languages';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@apps/attendance/application/combinedUseCaseInteractors/importer/CheckAndSaveTimesheetUseCaseInteractor';
import {
  AppDispatch,
  AppStore,
} from '@attendance/timesheet-pc-importer/store/AppStore';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

export default ({ dispatch, getState }: AppStore) =>
  (): IPresenter => ({
    start: () => {
      dispatch(actions.common.app.loadingStart());
    },
    confirmSubmittingWithoutErrorRecords: async () => {
      // UseCases.checkTimesheet の時点でデータが画面にエラーが反映されているので errors を持っているデータさえ見ればよい。
      const errored = DailyRecordViewModel.hasErrors([
        ...(getState().timesheet.records?.values() || []),
      ]);

      if (!errored) {
        return true;
      }

      dispatch(actions.common.app.loadingEnd());
      const answer = await ((dispatch as AppDispatch)(
        actions.common.app.confirm(
          msg().Att_Msg_ImpConfirmSubmittingWithoutErrorRecords
        )
      ) as Promise<boolean>);
      dispatch(actions.common.app.loadingStart());

      return answer;
    },
    complete: () => {},
    error: (err) => {
      dispatch(
        actions.common.app.catchApiError(
          err as Parameters<
            typeof actions['common']['app']['catchApiError']
          >[0],
          {
            isContinuable: true,
          }
        )
      );
    },
    finally: () => {
      dispatch(actions.common.app.loadingEnd());
    },
  });
