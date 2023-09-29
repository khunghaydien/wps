import { Reducer } from 'redux';

import {
  CostCenterList,
  getCostCenterList,
  getRecentlyUsed,
  searchCostCenter,
} from '../../../models/exp/CostCenter';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/COST_CENTER/LIST_SUCCESS',
};

const listSuccess = (costCenterList: CostCenterList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: costCenterList,
});

export const actions = {
  list:
    (
      parentId?: string,
      targetDate?: string,
      companyId?: string,
      empId?: string
    ) =>
    (dispatch: AppDispatch): void | any => {
      return getCostCenterList(
        companyId || null,
        parentId,
        targetDate,
        empId,
        null
      )
        .then((res: CostCenterList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  getRecentlyUsed:
    (employeeId: string, targetDate: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: CostCenterList; type: string }> => {
      return getRecentlyUsed(employeeId, targetDate)
        .then((res: CostCenterList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  searchCostCenter:
    (companyId: string, keyword: string, targetDate: string, usedIn?: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: CostCenterList; type: string }> => {
      return searchCostCenter(companyId, undefined, targetDate, keyword, usedIn)
        .then((res: CostCenterList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any, any>;
