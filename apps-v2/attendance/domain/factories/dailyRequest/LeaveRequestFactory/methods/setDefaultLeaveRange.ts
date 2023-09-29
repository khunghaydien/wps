import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) => {
  const leaveRanges = LeaveRequest.getAvailableLeaveRanges(request);
  const leaveRange =
    leaveRanges?.find((range) => range === request.leaveRange) ||
    leaveRanges?.at(0) ||
    null;
  return {
    ...request,
    leaveRange,
  };
};
