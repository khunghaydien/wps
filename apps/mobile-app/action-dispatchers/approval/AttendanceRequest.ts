import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { actions } from '../../modules/approval/entities/attendance/request';

import { AppDispatch } from '../AppThunk';

/* eslint-disable import/prefer-default-export */
export const getAttRequest = (requestId: string) => {
  return (dispatch: AppDispatch) => {
    return dispatch(withLoading(actions.get(requestId))).catch((err) => {
      dispatch(catchApiError(err));
      throw err;
    });
  };
};
