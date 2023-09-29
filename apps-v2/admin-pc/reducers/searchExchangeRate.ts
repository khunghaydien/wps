import { SEARCH_EXCHANGE_RATE } from '../actions/exchangeRate';

const initialState = [];

export default function searchExchangeRateReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_EXCHANGE_RATE:
      return action.payload;
    default:
      return state;
  }
}
