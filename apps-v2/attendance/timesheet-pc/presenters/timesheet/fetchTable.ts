import { Store } from 'redux';

import { catchApiError } from '@apps/commons/actions/app';

import { actions } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import { IPresenter } from '@attendance/application/useCaseInteractors/timesheet/FetchTableUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(actions.reset());
    dispatch(actions.startLoading());
  },
  complete: (response) => {
    dispatch(actions.set(response.layoutTable));
  },
  error: (err) => {
    dispatch(actions.reset());
    dispatch(actions.catchError());
    dispatch(
      catchApiError(err as Parameters<typeof catchApiError>[0], {
        isContinuable: true,
      })
    );
  },
  finally: () => {
    dispatch(actions.endLoading());
  },
});
