import { MasterEmployeeHistory } from '../../../../domain/models/organization/MasterEmployeeHistory';

export type State = MasterEmployeeHistory[];

export const initialState: State = [];

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/HISTORY_RECORD_LIST/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/HISTORY_RECORD_LIST/FETCH';
  payload: MasterEmployeeHistory[];
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/HISTORY_RECORD_LIST/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/HISTORY_RECORD_LIST/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (historyList: MasterEmployeeHistory[]): Fetch => ({
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
