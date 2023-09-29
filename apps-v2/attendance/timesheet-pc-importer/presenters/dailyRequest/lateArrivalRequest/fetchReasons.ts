import { Store } from 'redux';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRequest/lateArrivalRequest/FetchReasonsUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/dailyRequest/lateArrivalRequest/IFetchReasonsUseCase';

export default ({ dispatch }: Store) =>
  ({ targetDate }: IInputData): IPresenter => ({
    start: () => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'loadingLateArrivalRequestReasons',
          true
        )
      );
    },
    complete: ({ reasons }) => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'lateArrivalReasons',
          reasons ?? []
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
          'loadingLateArrivalRequestReasons',
          false
        )
      );
    },
  });
