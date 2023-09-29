import { Store } from 'redux';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { IPresenter } from '@attendance/application/useCaseInteractors/legalAgreementRequest/RemoveUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  confirmRemoving: async () => {
    dispatch(loadingEnd());
    const result = (await dispatch(
      // @ts-ignore
      confirm(msg().Appr_Msg_RequestConfirmRemove)
    )) as unknown as boolean;
    dispatch(loadingStart());
    return result;
  },
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
