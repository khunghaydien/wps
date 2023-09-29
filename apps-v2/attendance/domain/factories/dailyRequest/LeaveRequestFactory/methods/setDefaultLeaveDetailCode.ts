import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) => {
  const details = LeaveRequest.getLeave(request)?.details;
  return {
    ...request,
    leaveDetailCode: details?.get(request.leaveDetailCode)?.code || null,
  };
};
