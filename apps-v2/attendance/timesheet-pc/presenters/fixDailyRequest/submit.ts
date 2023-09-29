import { Store } from 'redux';

import {
  catchApiError,
  catchBusinessError,
  confirm,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { REASON } from '@attendance/domain/models/Result';

import FixSummaryRequestCheckDialog from '@attendance/timesheet-pc/components/dialogs/confirm/FixSummaryRequestCheckDialog';

import { IPresenter } from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  confirmToSubmitWithWarning: async (confirmation) => {
    dispatch(loadingEnd());
    const result = (await dispatch(
      // @ts-ignore
      confirm({
        Component: FixSummaryRequestCheckDialog,
        params: { confirmation },
      })
    )) as unknown as Promise<boolean>;
    dispatch(loadingStart());
    return result;
  },
  complete: (output) => {
    if (output.result === true) {
      return;
    }
    switch (output.reason) {
      case REASON.EXISTED_INVALID_REQUEST:
        dispatch(
          catchBusinessError(
            msg().Com_Lbl_Error,
            msg().Att_Err_InvalidRequestExist,
            msg().Att_Slt_InvalidRequestExist
          )
        );
        return;
      case REASON.EXISTED_SUBMITTING_REQUEST:
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
    dispatch(loadingEnd());
  },
});
