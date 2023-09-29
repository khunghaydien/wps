import { Store } from 'redux';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRequest/earlyLeaveRequest/FetchReasonsUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/dailyRequest/earlyLeaveRequest/IFetchReasonsUseCase';

export default ({ dispatch }: Store) =>
  ({ targetDate }: IInputData): IPresenter => ({
    start: () => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'loadingEarlyLeaveRequestReasons',
          true
        )
      );
    },
    complete: ({ reasons }) => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'earlyLeaveReasons',
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
          'loadingEarlyLeaveRequestReasons',
          false
        )
      );
    },
  });
