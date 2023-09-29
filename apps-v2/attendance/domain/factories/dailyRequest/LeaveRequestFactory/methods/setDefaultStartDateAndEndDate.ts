import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

/**
 *  開始日のデフォルト値の設定します。
 */
export default (targetDate: string) => (request: LeaveRequest.LeaveRequest) => {
  return request.leaveRange === LEAVE_RANGE.Day
    ? { ...request, startDate: targetDate || null, endDate: targetDate || null }
    : { ...request, startDate: targetDate || null, endDate: null };
};
