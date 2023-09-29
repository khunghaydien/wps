import { SEARCH_CREDIT_CARD } from '../actions/creditCard';

const initialState = [];

export default function searchCreditCardReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_CREDIT_CARD:
      return action.payload;
    default:
      return state;
  }
}
