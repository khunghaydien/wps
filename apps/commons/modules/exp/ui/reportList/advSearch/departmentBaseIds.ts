import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/DEPARTMENT_HISTORY_IDS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/DEPARTMENT_HISTORY_IDS/CLEAR',
  REPLACE:
    'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/DEPARTMENT_HISTORY_IDS/REPLACE',
};

type DepartmentHistoryIds = Array<string>;

export const actions = {
  set: (departmentHistoryId: string) => ({
    type: ACTIONS.SET,
    payload: departmentHistoryId,
  }),
  replace: (departmentHistoryIds: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: departmentHistoryIds,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state: DepartmentHistoryIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newDepList = _.cloneDeep(state);

      const newItem = action.payload;

      if (!_.includes(state, newItem)) {
        newDepList.push(newItem);
      } else {
        _.pull(newDepList, newItem);
      }

      return newDepList;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<DepartmentHistoryIds, any>;
