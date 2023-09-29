import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as resourceManagerAction } from '@apps/domain/modules/psa/resourceManager';

import { AppDispatch } from './AppThunk';

const getResourceManagerListByProjectManagerId =
  (projectManagerId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(resourceManagerAction.getListByProjectManagerId(projectManagerId))
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export default getResourceManagerListByProjectManagerId;
