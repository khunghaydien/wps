import { Store } from 'redux';

import msg from '@apps/commons/languages';
import { showToast } from '@commons/modules/toast';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { showConfirm } from '@mobile/modules/commons/confirm';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { actions as uiActions } from '@mobile/modules/attendance/timeStamp/ui';

import { IPresenter } from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelApprovalUseCaseInteractor';

export default ({ dispatch }: Store) =>
  (): IPresenter => {
    let loadingId;
    const $dispatch = dispatch as AppDispatch;
    return {
      start: () => {
        loadingId = $dispatch(startLoading());
      },
      confirm: async () => {
        $dispatch(endLoading(loadingId));
        const result = await $dispatch(
          showConfirm(msg().Appr_Msg_RequestConfirmCancelRequest)
        );
        loadingId = $dispatch(startLoading());
        return result;
      },
      complete: ({ result }) => {
        if (result) {
          $dispatch(showToast(msg().Att_Msg_CanceledFixDailyRequest));
          $dispatch(uiActions.clearComment());
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
