import { catchApiError } from '../../commons/actions/app';

import { CostCenter, CostCenterList } from '../../domain/models/exp/CostCenter';

import { actions as costCenterActions } from '../../domain/modules/exp/cost-center/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as costCenterSelectListActions } from '../modules/ui/expenses/dialog/costCenterSelect/list';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';

export const getCostCenterList =
  (
    parentId: string,
    targetDate: string,
    empHistoryId?: string,
    companyId?: string
  ) =>
  (dispatch: AppDispatch) => {
    const _ = undefined;
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      costCenterActions.list(parentId, targetDate, companyId, _, empHistoryId)
    )
      .then((result) => {
        dispatch(costCenterSelectListActions.set([result.payload]));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getCostCenterSearchResult =
  (companyId: string, keyword: string, targetDate: string) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      costCenterActions.searchCostCenter(
        companyId,
        keyword,
        targetDate,
        'REQUEST'
      )
    )
      .then((result) => {
        const payload = result.payload.map((x) => {
          return {
            ...x,
            id: x.historyId,
          };
        });
        dispatch(costCenterSelectListActions.setSearchResult(payload));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getNextCostCenterList =
  (
    item: CostCenter,
    items: CostCenterList,
    baseId: string,
    targetDate: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    const _ = undefined;
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      costCenterActions.list(baseId, targetDate, _, _, empHistoryId)
    )
      .then((result) => {
        items.push(result.payload);
        dispatch(costCenterSelectListActions.set(items));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
  };
