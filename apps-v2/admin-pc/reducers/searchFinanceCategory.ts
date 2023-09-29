import { SEARCH_FINANCE_CATEGORY } from '../actions/financeCategory';

const initialState = [];

export default function searchFinanceCategoryReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_FINANCE_CATEGORY:
      return action.payload;
    default:
      return state;
  }
}
