/**
 * 新規申請を作成する Factory です。
 */
import { compose } from '@commons/utils/FnUtil';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { ILeaveRepository } from '@attendance/domain/models/Leave';

import setDefaultLeaveCode from './methods/setDefaultLeaveCode';
import setDefaultLeaveDetailCode from './methods/setDefaultLeaveDetailCode';
import setDefaultLeaveRange from './methods/setDefaultLeaveRange';
import setDefaultStartDateAndEndDate from './methods/setDefaultStartDateAndEndDate';
import setLeaves from './methods/setLeaves';

interface ILeaveRequestFactory extends LeaveRequest.ILeaveRequestFactory {
  create: (
    request: LeaveRequest.LeaveRequest
  ) => Promise<LeaveRequest.LeaveRequest>;
}

export default ({ LeaveRepository }: { LeaveRepository: ILeaveRepository }) =>
  ({
    employeeId,
    targetDate,
  }: {
    employeeId?: string;
    targetDate: string;
  }): ILeaveRequestFactory => ({
    create: async (request) => {
      return compose(
        setDefaultStartDateAndEndDate(targetDate),
        setDefaultLeaveRange,
        setDefaultLeaveDetailCode,
        setDefaultLeaveCode,
        await setLeaves({ LeaveRepository })({
          employeeId,
          targetDate,
        })
      )(request);
    },
  });
