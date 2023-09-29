import { SEARCH_LATE_ARRIVAL_EARLY_LEAVE_REASON } from '../actions/lateArrivalEarlyLeaveReason';

const initialState = [];

export default function searchLateArrivalEarlyLeaveReasonReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_LATE_ARRIVAL_EARLY_LEAVE_REASON:
      return action.payload;
    default:
      return state;
  }
}
