import { SEARCH_VENDOR } from '../actions/vendor';

const initialState = [];

export default function searchVendorReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_VENDOR:
      return action.payload;
    default:
      return state;
  }
}
