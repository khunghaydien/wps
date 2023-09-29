import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) => {
  const leave =
    request?.leaves?.get(request.leaveCode) ||
    request?.leaves?.values().next().value;
  return {
    ...request,
    leaveCode: leave?.code || null,
  };
};
