import { Store } from 'redux';

import msg from '@apps/commons/languages';
import { showToast } from '@commons/modules/toast';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import {
  catchApiError,
  catchBusinessError,
} from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import askIgnoreWarning from '@mobile/action-dispatchers/attendance/userPrompts/askAttendanceRequestIgnoreWarning';

import { IPresenter } from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';

export default ({ dispatch }: Store) =>
  (): IPresenter => {
    let loadingId;
    const $dispatch = dispatch as AppDispatch;
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
          $dispatch(showToast(msg().Att_Msg_FixDailyRequestIsRequested));
          return;
        }
        switch (output.reason) {
          case 'existedInvalidRequest':
            dispatch(
              catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_InvalidRequestExist,
                msg().Att_Slt_InvalidRequestExist
              )
            );
            return;
          case 'existedSubmittingRequest':
            dispatch(
              catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_RequestingRequestExist,
                msg().Att_Slt_RequestingRequestExist
              )
            );
        }
      },
      error: (err) => {
        dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
      },
      finally: () => {
        $dispatch(endLoading(loadingId));
      },
    };
  };
