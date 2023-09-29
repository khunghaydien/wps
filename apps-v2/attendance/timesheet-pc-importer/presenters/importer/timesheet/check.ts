import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/importer/timesheet/CheckUseCaseInteractor';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) =>
  (): IPresenter => ({
    start: () => {
      dispatch(actions.common.app.loadingStart());
    },
    complete: (errors) => {
      dispatch(actions.timesheet.setServerErrors(errors));
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
      dispatch(actions.common.app.loadingEnd());
    },
  });
