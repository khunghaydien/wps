import { SEARCH_LEAVE_OF_ABSENCE } from '../actions/leaveOfAbsence';

const initialState = [];

export default function searchLeaveOfAbsenceReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_LEAVE_OF_ABSENCE:
      return action.payload;
    default:
      return state;
  }
}
