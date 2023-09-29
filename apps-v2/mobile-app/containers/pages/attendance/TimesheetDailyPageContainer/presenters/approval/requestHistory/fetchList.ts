import { Store } from 'redux';

import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { actions as EntitiesApprovalHistoriesActions } from '@mobile/modules/attendance/dailyRequest/entities/approvalHistories';

import { IPresenter } from '@attendance/application/useCaseInteractors/approval/requestHistory/FetchListUseCaseInteractor';

export default ({ dispatch: $dispatch }: Store) =>
  (): IPresenter => {
    let loadingId;
    const dispatch = $dispatch as AppDispatch;
    return {
      start: () => {
        loadingId = dispatch(startLoading());
      },
      complete: (result) => {
        dispatch(EntitiesApprovalHistoriesActions.initialize(result));
      },
      error: (err) => {
        dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
      },
      finally: () => {
        dispatch(endLoading(loadingId));
      },
    };
  };
