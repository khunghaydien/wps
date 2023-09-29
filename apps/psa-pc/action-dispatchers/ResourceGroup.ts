import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as resourceGroupAction } from '@apps/domain/modules/psa/resourceGroup';

import { AppDispatch } from './AppThunk';

const getResourceGroups =
  (companyId: string, psaGroupId: string, ownerId?: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(
      resourceGroupAction.getResourceGroups(companyId, psaGroupId, ownerId)
    )
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export default getResourceGroups;
