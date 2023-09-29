import { SEARCH_REST_REASON } from '../actions/restReason';

const initialState = [];

export default function searchRestReasonReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_REST_REASON:
      return action.payload;
    default:
      return state;
  }
}
