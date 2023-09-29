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
};
type State = Array<DefaultCostCenterInfo>;
export const costCenterArea = 'ReportCostCenter';

const ACTIONS = {
  ADD_DEFAULT_COST_CENTER: 'MODULES/ENTITIES/EXP/DEFAULT_COST_CENTER/ADD',
  CLEAR: 'MODULES/ENTITIES/EXP/DEFAULT_COST_CENTER/CLEAR',
};

const setList = (targetDate: string, costCenter: DefaultCostCenter) => ({
  type: ACTIONS.ADD_DEFAULT_COST_CENTER,
  payload: { targetDate, costCenter },
});

export const clearDefaultCostCenter = () => ({
  type: ACTIONS.CLEAR,
});

export const getDefaultCostCenter =
  (employeeId: string, targetDate: string) =>
  (dispatch: AppDispatch): Promise<DefaultCostCenter | void> => {
    dispatch(loadingStart({ areas: costCenterArea }));
    return fetchDefaultCostCenter(employeeId, targetDate)
      .then((res: DefaultCostCenter) => {
        dispatch(setList(targetDate, res));
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd(costCenterArea));
      });
  };

const initialState: State = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ADD_DEFAULT_COST_CENTER:
      return [
        ...state,
        {
          date: action.payload.targetDate,
          costCenter: action.payload.costCenter,
        },
      ];
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<any, any>;
