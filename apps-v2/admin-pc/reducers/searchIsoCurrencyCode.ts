import { SEARCH_ISO_CURRENCY_CODE } from '../actions/currency';

const initialState = [];

export default function searchIsoCurrencyCodeReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_ISO_CURRENCY_CODE:
      return action.payload;
    default:
      return state;
  }
}
