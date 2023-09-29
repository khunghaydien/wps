import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/leave/FetchListUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/leave/IFetchListUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) =>
  ({ targetDate }: IInputData): IPresenter => ({
    start: () => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'loadingLeaveRequestLeaves',
          true
        )
      );
    },
    complete: ({ leaves }) => {
      dispatch(
        actions.timesheet.setRecordValueByRecordDate(
          targetDate,
          'leaveRequestLeaves',
          Array.from(leaves?.values() || [])
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
          'loadingLeaveRequestLeaves',
          false
        )
      );
    },
  });
