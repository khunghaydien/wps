/**
 * 読み取り専用既存申請を作成する Factory です。
 */
import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

interface ILeaveRequestFactory extends LeaveRequest.ILeaveRequestFactory {
  create: (request: LeaveRequest.LeaveRequest) => LeaveRequest.LeaveRequest;
}

export default (): ILeaveRequestFactory => ({
  create: (request) => {
    return request;
  },
});
