import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/DEPARTMENT_HISTORY_IDS/SET',
  CLEAR: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/DEPARTMENT_HISTORY_IDS/CLEAR',
};

export type DepartmentHistoryIds = Array<string>;

type SetAction = {
  type: string;
  payload: DepartmentHistoryIds;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (departmentHistoryIds: DepartmentHistoryIds): SetAction => ({
    type: ACTIONS.SET,
    payload: departmentHistoryIds,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state: DepartmentHistoryIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<DepartmentHistoryIds, any>;
