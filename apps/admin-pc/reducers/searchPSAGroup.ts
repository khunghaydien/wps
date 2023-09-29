import { GET_PSA_GROUP, SEARCH_PSA_GROUP } from '../actions/psaGroup';

const initialState = [];

export default function searchPSAGroupReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_PSA_GROUP:
      return action.payload;
    default:
      return state;
  }
}

export function getPSAGroupReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PSA_GROUP:
      return action.payload;
    default:
      return state;
  }
}
