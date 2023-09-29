import { Reducer } from 'redux';

import {
  CostCenterList,
  getCostCenterList,
  searchCostCenter,
} from '../../../../domain/models/exp/CostCenter';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/COST_CENTER/GET_SUCESS',
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/COST_CENTER/SEARCH_SUCESS',
  SEARCH_WITH_TYPE_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/COST_CENTER/SEARCH_WITH_TYPE_SUCCESS',
};

const getSuccess = (body: CostCenterList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const searchSuccess = (body: CostCenterList) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

type Action = { payload: CostCenterList; type: string };

export const actions = {
  get:
    (
      companyId: string,
      parentId?: string,
      targetDate?: string,
      empId?: string,
      limitNumber?: number
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return getCostCenterList(
        companyId,
        parentId,
        targetDate,
        empId,
        limitNumber + 1
      )
        .then((res: CostCenterList) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  search:
    (
      companyId?: string,
      parentId?: string,
      targetDate?: string,
      query?: string,
      limitNumber?: number,
      isRequest?: boolean
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return searchCostCenter(
        companyId,
        parentId,
        targetDate,
        query,
        isRequest ? 'REQUEST' : null,
        [],
        limitNumber
      )
        .then((res: CostCenterList) => dispatch(searchSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    case ACTIONS.SEARCH_WITH_TYPE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CostCenterList, any>;
