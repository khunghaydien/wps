import { Store } from 'redux';

import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import {
  clear,
  set,
} from '@mobile/modules/attendance/timesheet/ui/daily/restReasons';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';

export default ({ dispatch }: Store) =>
  (): IPresenter => {
    let loadingId;
    return {
      start: () => {
        loadingId = (dispatch as AppDispatch)(startLoading());
      },
      complete: ({ restReasons }) => {
        dispatch(set(restReasons));
      },
      error: (err) => {
        dispatch(clear());
        dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
      },
      finally: () => {
        (dispatch as AppDispatch)(endLoading(loadingId));
      },
    };
  };
