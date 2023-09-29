import { SearchConditionV2 } from '../../../../repositories/organization/employee/EmployeeListRepository';

export type State = SearchConditionV2;

export const initialState: State = {
  targetDate: '',
  code: '',
  name: '',
  positionName: '',
  departmentName: '',
  includeInactiveEmployee: false,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_CONDITION/INITIALIZE';
  payload?: State;
};

type Set = {
  type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_CONDITION/SET';
  payload: {
    key: string;
    value: string;
  };
};

type Action = Initialize | Set;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_CONDITION/INITIALIZE';

export const SET: Set['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_CONDITION/SET';

export const actions = {
  initialize: (values?: State) => ({
    type: INITIALIZE,
    payload: values,
  }),
  set: (key: string, value: string): Set => ({
    type: SET,
    payload: {
      key,
      value,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE:
      return action.payload || initialState;
    case SET: {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };
    }

    default:
      return state;
  }
};
