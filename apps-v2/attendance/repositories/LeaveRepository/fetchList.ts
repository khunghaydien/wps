import Api from '@apps/commons/api';

import * as DomainLeave from '@attendance/domain/models/Leave';
import * as DomainLeaveRange from '@attendance/domain/models/LeaveRange';
import * as DomainLeaveType from '@attendance/domain/models/LeaveType';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

export type Leave = {
  name: string;
  code: string;
  type: DomainLeaveType.LeaveType;
  ranges: DomainLeaveRange.LeaveRange[];
  details: DomainLeave.Detail[];
  daysLeft: number | null;
  hoursLeft: number | null;
  timeLeaveDaysLeft: number | null;
  timeLeaveHoursLeft: number | null;
  requireReason: boolean;
};

export type Response = {
  leaves: Leave[];
};

const convert = (param: Leave): DomainLeave.Leave => ({
  ...DomainLeave.defaultValue,
  ...param,
  ranges: DomainLeaveRange.sort(param.ranges) || [],
  details: createMapByCode<DomainLeave.Detail>(
    param.details?.map((value) => ({
      ...value,
      ranges: DomainLeaveRange.sort(value.ranges) || [],
    }))
  ),
});

export default (async (param) =>
  Api.invoke({
    path: '/att/daily-leave/list',
    param: {
      targetDate: param.targetDate || null,
      empId: param.employeeId || null,
      ignoredId: param.ignoredId || null,
    },
  }).then(({ leaves }: Response) =>
    createMapByCode(leaves.map((value) => convert(value)))
  )) as DomainLeave.ILeaveRepository['fetchList'];
