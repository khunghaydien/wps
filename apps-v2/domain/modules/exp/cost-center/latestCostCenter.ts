import {
  getLatestCostCenter,
  LatestCostCenter,
} from '@apps/domain/models/exp/CostCenter';

import { AppDispatch } from '../AppThunk';

const ACTIONS = {
  GET_LATEST_COST_CENTER: 'MODULES/ENTITIES/EXP/LATEST_COST_CENTER/GET',
  CLEAR_LATEST_COST_CENTER: 'MODULES/ENTITIES/EXP/LATEST_COST_CENTER/CLEAR',
} as const;

type Get = {
  payload: LatestCostCenter;
  type: typeof ACTIONS.GET_LATEST_COST_CENTER;
};

type Clear = {
  type: typeof ACTIONS.CLEAR_LATEST_COST_CENTER;
};

export const actions = {
  get:
    (historyId: string, targetDate: string) =>
    (dispatch: AppDispatch): Promise<LatestCostCenter> => {
      return getLatestCostCenter(historyId, targetDate)
        .then((res: LatestCostCenter) => {
          dispatch({
            type: ACTIONS.GET_LATEST_COST_CENTER,
            payload: res,
          });
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
  clear: () => ({
    type: ACTIONS.CLEAR_LATEST_COST_CENTER,
  }),
};

const initialState = {} as LatestCostCenter;

export default (
  state = initialState,
  action: Get | Clear
): LatestCostCenter => {
  switch (action.type) {
    case ACTIONS.GET_LATEST_COST_CENTER:
      return action.payload;
    case ACTIONS.CLEAR_LATEST_COST_CENTER:
      return initialState;
    default:
      return state;
  }
};
