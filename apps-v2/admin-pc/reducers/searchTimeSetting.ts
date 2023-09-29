import { SEARCH_TIME_SETTING } from '../actions/timeSetting';

const initialState = [];

export default function searchJobReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_TIME_SETTING:
      return action.payload;
    default:
      return state;
  }
}
