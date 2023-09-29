import {
  defaultValue,
  MasterDepartmentBase,
} from '@apps/domain/models/organization/MasterDepartmentBase';

export type State = MasterDepartmentBase;

export const initialState: State = defaultValue;

// Actions

type Initialize = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/BASE_RECORD/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/BASE_RECORD/FETCH';
  payload: MasterDepartmentBase;
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/BASE_RECORD/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/BASE_RECORD/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (baseRecord: MasterDepartmentBase): Fetch => ({
    type: FETCH,
    payload: baseRecord,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }
    case FETCH: {
      return action.payload;
    }
    default:
      return state;
  }
};
