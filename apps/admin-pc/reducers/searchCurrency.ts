import { SEARCH_CURRENCY } from '../actions/currency';

const initialState = [];

export default function searchCurrencyReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_CURRENCY:
      return action.payload;
    default:
      return state;
  }
}
