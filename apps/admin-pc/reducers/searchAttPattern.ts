import { SEARCH_ATT_PATTERN } from '../actions/attPattern';

const initialState = [];

export default function searchAttPatternReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ATT_PATTERN:
      return action.payload;
    default:
      return state;
  }
}
