import { Store } from 'redux';

import msg from '@apps/commons/languages';
import { showToast } from '@commons/modules/toast';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import {
  catchApiError,
  catchBusinessError,
} from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { REASON } from '@attendance/domain/models/Result';

import { State } from '@mobile/modules';
import { actions as uiActions } from '@mobile/modules/attendance/timeStamp/ui';

import askIgnoreWarning from '@mobile/action-dispatchers/attendance/userPrompts/askAttendanceRequestIgnoreWarning';

import { IPresenter } from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';

export default (store: Store) => (): IPresenter => {
  let loadingId;
  const $dispatch = store.dispatch as AppDispatch;
  return {
    start: () => {
      loadingId = $dispatch(startLoading());
    },
    confirmToSubmitWithWarning: async (confirmation) => {
      $dispatch(endLoading(loadingId));

      const result = await $dispatch(askIgnoreWarning(confirmation));
      loadingId = $dispatch(startLoading());
      return result;
    },
    complete: (output) => {
      if (output.result === true) {
        const state = store.getState() as State;
        if (!state?.attendance?.timeStamp?.ui?.sending) {
          $dispatch(showToast(msg().Att_Msg_FixDailyRequestIsRequested));
        }
        $dispatch(uiActions.clearComment());
        return;
      }
      switch (output.reason) {
        case REASON.EXISTED_INVALID_REQUEST:
          $dispatch(
            catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_InvalidRequestExist,
              msg().Att_Slt_InvalidRequestExist
            )
          );
          return;
        case REASON.EXISTED_SUBMITTING_REQUEST:
          $dispatch(
            catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_RequestingRequestExist,
              msg().Att_Slt_RequestingRequestExist
            )
          );
      }
    },
    error: (err) => {
      $dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
    },
    finally: () => {
      $dispatch(endLoading(loadingId));
    },
  };
};
