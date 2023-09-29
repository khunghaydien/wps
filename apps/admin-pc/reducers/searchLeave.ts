import { LEAVE_TYPE } from '../../domain/models/attendance/LeaveType';

import { SEARCH_LEAVE } from '../actions/leave';

const initialState = [];

export default function searchLeaveReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_LEAVE:
      return action.payload.filter(
        (record) => record.leaveType !== LEAVE_TYPE.Compensatory
      );
    default:
      return state;
  }
}
