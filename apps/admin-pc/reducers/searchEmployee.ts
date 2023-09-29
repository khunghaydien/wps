import { SEARCH_EMPLOYEE, SEARCH_EMPLOYEE_MINIMAL } from '../actions/employee';

const initialState = [];

export default function searchEmployeeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_EMPLOYEE:
      return action.payload;
    case SEARCH_EMPLOYEE_MINIMAL:
      return action.payload;
    default:
      return state;
  }
}
