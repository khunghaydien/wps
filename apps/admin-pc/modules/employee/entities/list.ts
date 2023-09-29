import { Employee } from '../../../../repositories/organization/employee/EmployeeListRepository';

type State = Employee[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/LIST/FETCH';
  payload: Employee[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (employees: Employee[] = []) => ({
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
