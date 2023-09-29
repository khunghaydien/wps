import { Store } from 'redux';

import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { AppDispatch } from '@mobile/action-dispatchers/AppThunk';

import { IPresenter } from '@attendance/application/useCaseInteractors/IUseCaseInteractor';

export default (store: Store) => (): IPresenter => {
  let loadingId;
  const dispatch = store.dispatch as AppDispatch;
  return {
    start: () => {
      loadingId = dispatch(startLoading());
    },
    complete: () => {},
    error: () => {},
    finally: () => {
      dispatch(endLoading(loadingId));
    },
  };
};
