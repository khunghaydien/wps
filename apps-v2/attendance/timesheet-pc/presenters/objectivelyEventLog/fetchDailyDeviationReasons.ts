import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import {
  clear,
  set,
} from '@apps/attendance/timesheet-pc/modules/entities/dailyDeviatedReason';

import { IPresenter } from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchDailyDeviationReasonsUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: ({ id, deviationReasons }) => {
    dispatch(set({ id, deviationReasons }));
  },
  error: (err) => {
    dispatch(clear());
    dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
