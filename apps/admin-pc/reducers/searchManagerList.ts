import { SEARCH_MANAGER_LIST } from '../actions/managerList';

const initialState = [];

export default function searchManagerListReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_MANAGER_LIST:
      return action.payload;
    default:
      return state;
  }
}
