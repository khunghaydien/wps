import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { actions as projectUploadActions } from '@apps/domain/modules/psa/projectUpload';

import { AppDispatch } from './AppThunk';

export const uploadProject =
  (projectId: string, file: File) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(projectUploadActions.upload(projectId, file))
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const initializeProjectUpload = () => (dispatch: AppDispatch) => {
  dispatch(projectUploadActions.initialize());
};
