import { SEARCH_POSITION } from '@admin-pc-v2/actions/position';

const initialState = [];

export default function searchPositionReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_POSITION:
      return action.payload;
    default:
      return state;
  }
}
