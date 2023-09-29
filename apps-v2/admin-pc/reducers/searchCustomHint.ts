import { SEARCH_CUSTOM_HINT } from '../actions/customHint';

const initialState = {};

export default function searchCustomHint(state = initialState, action) {
  switch (action.type) {
    case SEARCH_CUSTOM_HINT:
      const payload = action.payload.length > 0 ? action.payload[0] : {};
      return payload;
    default:
      return state;
  }
}
