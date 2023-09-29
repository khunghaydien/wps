import { SEARCH_COUNTRY } from '../actions/country';

const initialState = [];

export default function searchCountryReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_COUNTRY:
      return action.payload;
    default:
      return state;
  }
}
