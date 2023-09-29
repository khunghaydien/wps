import { SEARCH_TAX_TYPE } from '../actions/taxType';

const initialState = [];

export default function searchTaxTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_TAX_TYPE:
      return action.payload;
    default:
      return state;
  }
}
