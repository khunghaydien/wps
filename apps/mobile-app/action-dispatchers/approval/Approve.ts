import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { actions as approveActions } from '../../modules/approval/entities/approve';

import { AppDispatch } from '../AppThunk';

/* eslint-disable import/prefer-default-export */
export const approve = (requestIdList: Array<string>, comment: string) => {
  return (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(approveActions.approve(requestIdList, comment))
    ).catch((err) => {
      dispatch(catchApiError(err));
      throw err;
    });
  };
};
