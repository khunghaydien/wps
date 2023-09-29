import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) =>
  LeaveRequest.getLeave(request);
