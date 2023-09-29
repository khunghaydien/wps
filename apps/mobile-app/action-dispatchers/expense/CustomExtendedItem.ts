import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as costomEIOptionActions } from '../../modules/expense/entities/customEIOption';

/**
 * Search lookup extended items by code and name
 *
 * @param {string} extendedItemCustomId
 * @param {string} [query] string contained in either code or name
 */
export const getCustomExtendItemOptions =
  (extendedItemCustomId: string, query?: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(costomEIOptionActions.get(extendedItemCustomId, query))
    );

export const getRecentlyUsed =
  (eiCustomId: string, eiLookupId: string, empId: string) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        costomEIOptionActions.getRecentlyUsed(eiCustomId, eiLookupId, empId)
      )
    );
