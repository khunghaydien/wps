import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { VendorItem } from '../../../domain/models/exp/Vendor';

import { actions as vendorDetailAction } from '../../modules/approval/entities/expense/vendor';

import { AppDispatch } from '../AppThunk';

/* eslint-disable import/prefer-default-export */
export const getVendorDetail = (id: string) => (dispatch: AppDispatch) => {
  return dispatch(withLoading(vendorDetailAction.get(id)))
    .then((res: VendorItem) => res)
    .catch((err) => {
      dispatch(catchApiError(err));
      throw err;
    });
};
