import { withLoading } from '../../modules/commons/loading';

import {
  getLatestCostCenter,
  LatestCostCenter,
} from '@apps/domain/models/exp/CostCenter';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as costCenterListActions } from '../../modules/expense/entities/costCenterList';
import { getDefaultCostCenter } from '../../modules/expense/entities/defaultCostCenterList';

export const getCostCenterList =
  (
    companyId: string,
    parentId?: string,
    targetDate?: string,
    limitNumber?: number
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        costCenterListActions.get(
          companyId,
          parentId,
          targetDate,
          undefined,
          limitNumber
        )
      )
    );

export const searchCostCenter =
  (
    companyId: string,
    targetDate?: string,
    query?: string,
    limitNumber?: number,
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        costCenterListActions.search(
          companyId,
          null,
          targetDate,
          query,
          limitNumber,
          isRequest
        )
      )
    );

export const searchDefaultCoastCenter =
  (employeeId: string, targetDate: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(getDefaultCostCenter(employeeId, targetDate)));

export const getLatestHistoryCostCenter =
  (historyId: string, targetDate: string) =>
  (dispatch: AppDispatch): Promise<LatestCostCenter | boolean> =>
    dispatch(
      withLoading(() =>
        getLatestCostCenter(historyId, targetDate)
          .then((res) => res)
          .catch(() => false)
      )
    );
