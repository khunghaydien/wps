import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as vendorListActions } from '../../modules/expense/entities/vendorList';

export const getRecentVendor =
  (empBaseId: string, companyId: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(vendorListActions.getRecentlyUsed(empBaseId, companyId))
    );

export const searchVendor =
  (companyId: string, query: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(vendorListActions.get(companyId, query)));
