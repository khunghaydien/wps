import { isForReapply } from '@attendance/domain/models/AttDailyRequest';
import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { ILeaveRepository } from '@attendance/domain/models/Leave';

export default ({ LeaveRepository }: { LeaveRepository: ILeaveRepository }) =>
  async ({
    targetDate,
    employeeId,
    ignoredId,
  }: {
    targetDate: string;
    employeeId?: string;
    ignoredId?: string;
  }) => {
    const leaves =
      (await LeaveRepository.fetchList({
        targetDate,
        employeeId,
        ignoredId,
      })) || null;
    return (request: LeaveRequest.LeaveRequest) => {
      if (isForReapply(request) && !leaves?.get(request.leaveCode)) {
        return request;
      } else {
        return {
          ...request,
          leaves,
        };
      }
    };
  };
