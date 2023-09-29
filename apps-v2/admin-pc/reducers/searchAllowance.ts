import { SEARCH_ALLOWANCE } from '../actions/allowance';

const initialState = [];

export default function searchAllowanceReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ALLOWANCE:
      return action.payload;
    default:
      return state;
  }
}
