import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';

import {
  DefaultCostCenter,
  getDefaultCostCenter as fetchDefaultCostCenter,
} from '../../../models/exp/CostCenter';

import { AppDispatch } from '../AppThunk';

export type DefaultCostCenterInfo = {
  costCenter: DefaultCostCenter | Record<string, never>;
  date: string;
  empHistoryId?: string;
};
type State = Array<DefaultCostCenterInfo>;
export const costCenterArea = 'ReportCostCenter';

const ACTIONS = {
  ADD_DEFAULT_COST_CENTER: 'MODULES/ENTITIES/EXP/DEFAULT_COST_CENTER/ADD',
  CLEAR_DEFAULT_COST_CENTER: 'MODULES/ENTITIES/EXP/DEFAULT_COST_CENTER/CLEAR',
};

const setList = (
  targetDate: string,
  costCenter: DefaultCostCenter,
  empHistoryId?: string
) => ({
  type: ACTIONS.ADD_DEFAULT_COST_CENTER,
  payload: { targetDate, costCenter, empHistoryId },
});

const clearList = () => ({ type: ACTIONS.CLEAR_DEFAULT_COST_CENTER });

export const getDefaultCostCenter =
  (employeeId: string, targetDate: string, empHistoryId?: string) =>
  (dispatch: AppDispatch, getState): Promise<DefaultCostCenter | void> => {
    if (!getState().common.app.loadingAreas.includes(costCenterArea))
      dispatch(loadingStart({ areas: costCenterArea }));
    return fetchDefaultCostCenter(employeeId, targetDate, empHistoryId)
      .then((res: DefaultCostCenter) => {
        dispatch(setList(targetDate, res, empHistoryId));
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd(costCenterArea));
      });
  };

export const clearDefaultCostCenter = () => (dispatch: AppDispatch) => {
  return dispatch(clearList());
};

const initialState: State = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ADD_DEFAULT_COST_CENTER:
      const costCenters = [...state];
      const existingCCByDate = costCenters.find(
        (cc) =>
          cc.date === action.payload.targetDate &&
          cc.empHistoryId === action.payload.empHistoryId
      );
      if (existingCCByDate)
        existingCCByDate.costCenter = action.payload.costCenter;
      else
        costCenters.push({
          date: action.payload.targetDate,
          costCenter: action.payload.costCenter,
          empHistoryId: action.payload.empHistoryId,
        });
      return costCenters;
    case ACTIONS.CLEAR_DEFAULT_COST_CENTER:
      return initialState;
    default:
      return state;
  }
}) as Reducer<any, any>;
