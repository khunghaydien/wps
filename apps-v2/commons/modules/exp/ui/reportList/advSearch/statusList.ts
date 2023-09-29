import { Reducer } from 'redux';

import { cloneDeep, includes, pull } from 'lodash';

import { initialSearchCondition } from '../../../../../../domain/models/exp/request/Report';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/STATUS_LIST/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/STATUS_LIST/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/STATUS_LIST/REPLACE',
  RESET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/STATUS_LIST/RESET',
};

type Statuses = Array<string>;

// now only set is used, replace and clear will be needed after 'save/delete condition'
export const actions = {
  set: (status: string) => ({
    type: ACTIONS.SET,
    payload: status,
  }),
  replace: (status: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: status,
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

// reducer
const initialStatuses = initialSearchCondition.statusList;
export default ((state: Statuses = initialStatuses, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newStatusList = cloneDeep(state);
      const newItem = action.payload;

      if (!includes(state, newItem)) {
        newStatusList.push(newItem);
      } else {
        pull(newStatusList, newItem);
      }

      return newStatusList;
    case ACTIONS.RESET:
      return initialStatuses;
    case ACTIONS.CLEAR:
      return [];
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Statuses, any>;
