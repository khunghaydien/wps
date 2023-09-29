import { EmployeeV2 } from '../../../../repositories/organization/employee/EmployeeListRepository';

type State = EmployeeV2[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/ENTITIES/LIST/FETCH';
  payload: EmployeeV2[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (employees: EmployeeV2[] = []) => ({
    type: FETCH,
    payload: employees,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH: {
      const { payload } = action;
      return [...payload];
    }

    default:
      return state;
  }
};
