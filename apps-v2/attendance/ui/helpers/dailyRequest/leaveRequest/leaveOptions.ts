import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) =>
  Array.from(request?.leaves?.values() || []).map((leave) => ({
    label: leave.name,
    value: leave.code,
  }));
