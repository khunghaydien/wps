import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EMPLOYEE_HISTORY_IDS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EMPLOYEE_HISTORY_IDS/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EMPLOYEE_HISTORY_IDS/REPLACE',
};

type EmployeeHistoryIds = Array<string>;

export const actions = {
  set: (employeeBaseId: string) => ({
    type: ACTIONS.SET,
    payload: employeeBaseId,
  }),
  replace: (employeeBaseIds: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: employeeBaseIds,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state: EmployeeHistoryIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      let newEmpList = _.cloneDeep(state);

      const target = action.payload;
      if (typeof target === 'string') {
        if (!_.includes(state, target)) {
          newEmpList.push(target);
        } else {
          _.pull(newEmpList, target);
        }
      } else {
        newEmpList = target;
      }

      return newEmpList;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<EmployeeHistoryIds, any>;
