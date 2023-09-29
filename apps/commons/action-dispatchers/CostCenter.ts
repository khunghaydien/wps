import { CostCenter, CostCenterList } from '../../domain/models/exp/CostCenter';

import { actions as costCenterActions } from '../../domain/modules/exp/cost-center/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as costCenterSelectListActions } from '../modules/costCenterDialog/ui/list';
import { costCenterArea } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import { catchApiError, loadingEnd, loadingStart } from '../actions/app';

export const getRecentCostCenters =
  (empId: string, targetDate: string) => (dispatch: AppDispatch) => {
    return dispatch(costCenterActions.getRecentlyUsed(empId, targetDate))
      .then((result) => {
        const payload = result.payload.map((x) => {
          return {
            ...x,
            id: x.historyId,
          };
        });
        dispatch(costCenterSelectListActions.setRecentResult(payload));
        return payload;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const searchCostCenters =
  (companyId: string, keyword: string, targetDate: string) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      costCenterActions.searchCostCenter(
        companyId,
        keyword,
        targetDate,
        'REPORT'
      )
    )
      .then((result) => {
        const payload = result.payload.map((x) => {
          return {
            ...x,
            id: x.historyId,
            baseId: x.id,
          };
        });
        dispatch(costCenterSelectListActions.setSearchResult(payload));
        return payload;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const getCostCenterList =
  (
    parentId: string,
    targetDate: string,
    companyId?: string,
    empId?: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return dispatch(
      costCenterActions.list(parentId, targetDate, companyId, empId)
    )
      .then((result) => {
        dispatch(costCenterSelectListActions.set([result.payload]));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

export const getCostCenterSearchResult =
  (
    companyId: string,
    keyword: string,
    targetDate: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return dispatch(searchCostCenters(companyId, keyword, targetDate)).then(
      () => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      }
    );
  };

export const getNextCostCenterList =
  (
    item: CostCenter,
    items: CostCenterList,
    baseId: string,
    targetDate: string,
    companyId?: string,
    empId?: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    return dispatch(
      costCenterActions.list(baseId, targetDate, companyId, empId)
    )
      .then((result) => {
        items.push(result.payload);
        dispatch(costCenterSelectListActions.set(items));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

export const getLatestHistoryCostCenter =
  (historyId: string, targetDate: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart({ areas: costCenterArea }));
    return dispatch(latestCostCenterActions.get(historyId, targetDate))
      .then((response) => response)
      .catch(() => false)
      .finally(() => {
        dispatch(loadingEnd(costCenterArea));
      });
  };
