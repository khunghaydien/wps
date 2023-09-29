import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as taxTypeActions } from '../../modules/expense/entities/taxType';
import { actions as taxTypeCacheActions } from '../../modules/expense/ui/tax/taxTypes';

/**
 * Get tax type list based on expense type and date
 * @deprecated
 * @param {string} expTypeId
 * @param {string} targetDate
 */
export const getTaxTypeList =
  (expTypeId: string, targetDate: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(taxTypeActions.list(expTypeId, targetDate)));

/**
 * Get and cache tax type list by expense type and date, for easier cache reuse
 *
 * @param {string} expTypeId
 * @param {string} targetDate
 */
export const searchTaxListByDateExpType =
  (expTypeId: string, targetDate: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(taxTypeCacheActions.search(expTypeId, targetDate)));
