import { FETCH_CURRENCY_LIST } from '../actions/currencyList';

export default function currencyListReducer(state = [], action) {
  switch (action.type) {
    case FETCH_CURRENCY_LIST:
      return action.payload;
    default:
      return state;
  }
}
