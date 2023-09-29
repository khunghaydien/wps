import { Reducer } from 'redux';

import { catchApiError } from '../../../../commons/actions/app';

import {
  DefaultCostCenter,
  getDefaultCostCenter as searchDefaultCostCenter,
} from '../../../../domain/models/exp/CostCenter';

import { AppDispatch } from '../AppThunk';

export type DefaultCostCenterInfo = {
  date: string;
  costCenter: DefaultCostCenter | Record<string, never>;
};
type State = Array<DefaultCostCenterInfo>;

const ACTIONS = {
  ADD_DEFAULT_COST_CENTER: 'MODULES/ENTITIES/ENTITIES/DEFAULT_COST_CENTER/ADD',
};

const addDefaultCostCenter = (
  targetDate: string,
  costCenter: DefaultCostCenter
) => ({
  type: ACTIONS.ADD_DEFAULT_COST_CENTER,
  payload: { targetDate, costCenter },
});

export const getDefaultCostCenter =
  (employeeId: string, targetDate: string) =>
  (dispatch: AppDispatch): Promise<DefaultCostCenter> => {
    return searchDefaultCostCenter(employeeId, targetDate)
      .then((res: DefaultCostCenter) => {
        dispatch(addDefaultCostCenter(targetDate, res));
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
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
    default:
      return state;
  }
}) as Reducer<State, any>;
