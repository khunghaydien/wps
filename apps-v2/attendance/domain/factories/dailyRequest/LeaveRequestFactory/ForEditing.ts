/**
 * 編集用専用既存申請を作成する Factory です。
 */
import { compose } from '@commons/utils/FnUtil';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { ILeaveRepository } from '@attendance/domain/models/Leave';

import setDefaultLeaveCode from './methods/setDefaultLeaveCode';
import setDefaultLeaveDetailCode from './methods/setDefaultLeaveDetailCode';
import setDefaultLeaveRange from './methods/setDefaultLeaveRange';
import setLeaves from './methods/setLeaves';

interface ILeaveRequestFactory extends LeaveRequest.ILeaveRequestFactory {
  create: (
    request: LeaveRequest.LeaveRequest
  ) => Promise<LeaveRequest.LeaveRequest>;
}

export default ({ LeaveRepository }: { LeaveRepository: ILeaveRepository }) =>
  ({
    targetDate,
    employeeId,
    ignoredId,
  }: {
    targetDate: string;
    employeeId?: string;
    ignoredId?: string;
  }): ILeaveRequestFactory => ({
    create: async (request) =>
      compose(
        setDefaultLeaveRange,
        setDefaultLeaveDetailCode,
        setDefaultLeaveCode,
        await setLeaves({ LeaveRepository })({
          employeeId,
          targetDate,
          ignoredId,
        })
      )(request),
  });
