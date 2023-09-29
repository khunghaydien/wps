import { SEARCH_EMPLOYEE_GROUP } from '../actions/employeeGroup';

const initialState = [];

export default function searchGroupReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_EMPLOYEE_GROUP:
      return action.payload;
    default:
      return state;
  }
}
