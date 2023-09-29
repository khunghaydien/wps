import { SEARCH_EXPENSE_TYPE } from '../actions/expenseType';

const initialState = [];

export default function searchExpenseTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_EXPENSE_TYPE:
      return action.payload;
    default:
      return state;
  }
}
