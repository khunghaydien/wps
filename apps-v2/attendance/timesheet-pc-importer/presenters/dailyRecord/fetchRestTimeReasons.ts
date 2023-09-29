import { Store } from 'redux';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';

export default ({ dispatch }: Store) =>
  ({ targetDate }: IInputData): IPresenter => ({
    start: () => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'loadingRestTimeReasons',
          true
        )
      );
    },
    complete: ({ restReasons }) => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'restTimeReasons',
          restReasons ?? []
        )
      );
    },
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
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'loadingRestTimeReasons',
          false
        )
      );
    },
  });
