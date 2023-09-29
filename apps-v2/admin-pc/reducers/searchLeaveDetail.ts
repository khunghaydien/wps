import { SEARCH_LEAVE_DETAIL } from '../actions/leaveDetail';

const initialState = [];

export default function searchLeaveDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_LEAVE_DETAIL:
      return action.payload;
    default:
      return state;
  }
}
