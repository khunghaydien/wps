import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { IPresenter } from '@attendance/application/useCaseInteractors/legalAgreementRequest/CancelRequestUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: () => {},
  error: (err) => {
    dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
