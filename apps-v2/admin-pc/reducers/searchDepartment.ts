import { SEARCH_DEPARTMENT } from '../actions/department';

const initialState = [];

export default function searchDepartmentReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_DEPARTMENT:
      return action.payload;
    default:
      return state;
  }
}
