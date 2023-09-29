import { MasterDepartmentHistory } from '@apps/domain/models/organization/MasterDepartmentHistory';

export type State = MasterDepartmentHistory[];

export const initialState: State = [];

// Actions
type Initialize = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/HISTORY_RECORD_LIST/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/HISTORY_RECORD_LIST/FETCH';
  payload: MasterDepartmentHistory[];
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/HISTORY_RECORD_LIST/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/ENTITIES/HISTORY_RECORD_LIST/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (historyList: MasterDepartmentHistory[]): Fetch => ({
    type: FETCH,
    payload: historyList,
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
