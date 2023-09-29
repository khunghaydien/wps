import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/EMP_BASE_ID_LIST/SET',
  CLEAR: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/EMP_BASE_ID_LIST/CLEAR',
};

export type EmployeeHistoryIds = Array<string>;

type SetAction = {
  type: string;
  payload: EmployeeHistoryIds;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (employeeBaseIds: EmployeeHistoryIds): SetAction => ({
    type: ACTIONS.SET,
    payload: employeeBaseIds,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state: EmployeeHistoryIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<EmployeeHistoryIds, any>;
