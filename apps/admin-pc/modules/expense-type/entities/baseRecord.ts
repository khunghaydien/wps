import {
  defaultValue,
  ExpenseType,
} from '../../../../domain/models/exp/ExpenseType';

export type State = ExpenseType;

export const initialState: State = defaultValue;

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/BASE_RECORD/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/BASE_RECORD/FETCH';
  payload: ExpenseType;
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/BASE_RECORD/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/BASE_RECORD/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (baseRecord: ExpenseType): Fetch => ({
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
