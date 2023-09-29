import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as extendedItemActions } from '@apps/domain/modules/psa/psaExtendedItem';

import { AppDispatch } from './AppThunk';

export const getExtendedItemList =
  (companyId: string, objectType: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(extendedItemActions.list(companyId, objectType))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
