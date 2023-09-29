import { Department } from '@apps/repositories/organization/department/DepartmentListRepository';

type State = Department[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/LIST/FETCH';
  payload: Department[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (departments: Department[] = []) => ({
    type: FETCH,
    payload: departments,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH: {
      return action.payload;
    }
    default:
      return state;
  }
};
