import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import {
  clear,
  set,
} from '@attendance/timesheet-pc/modules/entities/restTimeReasons';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: ({ restReasons }) => {
    dispatch(set(restReasons));
  },
  error: (err) => {
    dispatch(clear());
    dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
