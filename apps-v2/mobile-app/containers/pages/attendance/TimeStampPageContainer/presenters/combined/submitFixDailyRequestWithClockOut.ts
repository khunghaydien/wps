import { Store } from 'redux';

import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';

import { IPresenter } from '@attendance/application/combinedUseCaseInteractors/SubmitFixDailyRequestWithClockOutUseCaseInteractor';

export default (store: Store) => (): IPresenter => {
  const $dispatch = store.dispatch as AppDispatch;
  return {
    start: () => {},
    complete: ({ result }) => {
      if (result) {
        $dispatch(
          showToast(msg().Att_Msg_ClockOutAndFixDailyRequestAreRequested)
        );
      }
    },
    error: () => {},
    finally: () => {},
  };
};
