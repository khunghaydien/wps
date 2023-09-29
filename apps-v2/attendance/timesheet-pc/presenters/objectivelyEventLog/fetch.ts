import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import {
  clear,
  set,
} from '@attendance/timesheet-pc/modules/entities/objectivelyEventLog';

import { IPresenter } from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: ({ objectivelyEventLogs }) => {
    dispatch(set(objectivelyEventLogs));
  },
  error: (err) => {
    dispatch(clear());
    dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
