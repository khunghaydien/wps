import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { actions as rejectActions } from '../../modules/approval/entities/reject';

import { AppDispatch } from '../AppThunk';

/* eslint-disable import/prefer-default-export */
export const reject = (requestIdList: Array<string>, comment: string) => {
  return (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(rejectActions.reject(requestIdList, comment))
    ).catch((err) => {
      dispatch(catchApiError(err));
      throw err;
    });
  };
};
