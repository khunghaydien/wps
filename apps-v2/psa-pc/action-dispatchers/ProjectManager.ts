import { loadingEnd, loadingStart } from '@apps/commons/actions/app';

import { actions as projectManagerAction } from '@apps/domain/modules/psa/projectManager';

import { AppDispatch } from './AppThunk';

const saveProjectManagerLocally =
  (projectManagerId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    await dispatch(projectManagerAction.saveLocal(projectManagerId));
    dispatch(loadingEnd());
  };

export default saveProjectManagerLocally;
