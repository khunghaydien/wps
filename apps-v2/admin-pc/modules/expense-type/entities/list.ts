import { ExpenseType } from '../../../../domain/models/exp/ExpenseType';

type State = ExpenseType[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/LIST/FETCH';
  payload: ExpenseType[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (workCategories: ExpenseType[] = []) => ({
    type: FETCH,
    payload: workCategories,
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
