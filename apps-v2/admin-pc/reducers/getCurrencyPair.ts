import { GET_CURRENCY_PAIR } from '../actions/exchangeRate';

const initialState = [];

export default function getCurrencyPairReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENCY_PAIR:
      return action.payload;
    default:
      return state;
  }
}
