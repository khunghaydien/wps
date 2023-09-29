import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/COST_CENTER_IDS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/COST_CENTER_IDS/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/COST_CENTER_IDS/REPLACE',
};

type CostCenterIds = Array<string>;

export const actions = {
  set: (costCenterId: string) => ({
    type: ACTIONS.SET,
    payload: costCenterId,
  }),
  replace: (costCenterIds: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: costCenterIds,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state: CostCenterIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newCostCenterList = _.cloneDeep(state);

      const newItem = action.payload;

      if (!_.includes(state, newItem)) {
        newCostCenterList.push(newItem);
      } else {
        _.pull(newCostCenterList, newItem);
      }

      return newCostCenterList;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CostCenterIds, any>;
