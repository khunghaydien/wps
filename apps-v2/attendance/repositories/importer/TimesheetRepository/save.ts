import Api from '@apps/commons/api';

import {
  EarlyLeaveRequest,
  EarlyStartWorkRequest,
  HolidayWorkRequest,
  LateArrivalRequest,
  LeaveRequest,
  OvertimeWorkRequest,
} from '@apps/attendance/domain/models/importer/DailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import {
  ITimesheetRepository,
  Timesheet as DomainTimesheet,
} from '@attendance/domain/models/importer/Timesheet';

const convertToParam = (timesheet: DomainTimesheet) => {
  return {
    empId: timesheet.employeeId,
    importRecords: timesheet.records.map((record) => {
      const rest1Time = record.restTimes?.at(0);
      const rest2Time = record.restTimes?.at(1);
      const leaveRequests = record.requests?.filter(
        ({ type }) => type === CODE.Leave
      ) as LeaveRequest[];
      const leaveRequest1 = leaveRequests?.at(0);
      const overtimeWorkRequest = record.requests?.find(
        ({ type }) => type === CODE.OvertimeWork
      ) as OvertimeWorkRequest;
      const earlyStartWorkRequest = record.requests?.find(
        ({ type }) => type === CODE.EarlyStartWork
      ) as EarlyStartWorkRequest;
      const earlyLeaveRequest = record.requests?.find(
        ({ type }) => type === CODE.EarlyLeave
      ) as EarlyLeaveRequest;
      const lateArrivalRequest = record.requests?.find(
        ({ type }) => type === CODE.LateArrival
      ) as LateArrivalRequest;
      const holidayWorkRequest = record.requests?.find(
        ({ type }) => type === CODE.HolidayWork
      ) as HolidayWorkRequest;

      return {
        targetDate: record.recordDate,
        startTime: record.startTime,
        endTime: record.endTime,
        rest1StartTime: rest1Time?.startTime ?? null,
        rest1EndTime: rest1Time?.endTime ?? null,
        rest1ReasonCode: rest1Time?.restReason?.code ?? '',
        rest2StartTime: rest2Time?.startTime ?? null,
        rest2EndTime: rest2Time?.endTime ?? null,
        rest2ReasonCode: rest2Time?.restReason?.code ?? '',
        // 休暇申請1
        useLeave1: !!leaveRequest1,
        leave1Code: leaveRequest1?.leaveCode ?? '',
        leave1Range: leaveRequest1?.leaveRange ?? null,
        leave1StartTime: leaveRequest1?.startTime ?? null,
        leave1EndTime: leaveRequest1?.endTime ?? null,
        leave1Reason: leaveRequest1?.reason ?? '',
        leave1Remarks: leaveRequest1?.remarks ?? '',
        // 残業申請
        useOvertimeWork: !!overtimeWorkRequest,
        overtimeWorkStartTime: overtimeWorkRequest?.startTime ?? null,
        overtimeWorkEndTime: overtimeWorkRequest?.endTime ?? null,
        overtimeWorkRemarks: overtimeWorkRequest?.remarks ?? '',
        // 早朝勤務申請
        useEarlyStartWork: !!earlyStartWorkRequest,
        earlyStartWorkStartTime: earlyStartWorkRequest?.startTime ?? null,
        earlyStartWorkEndTime: earlyStartWorkRequest?.endTime ?? null,
        earlyStartWorkRemarks: earlyStartWorkRequest?.remarks ?? '',
        // 遅刻申請
        useEarlyLeave: !!earlyLeaveRequest,
        earlyLeaveReason: earlyLeaveRequest?.reasonText ?? null,
        earlyLeaveReasonCode: earlyLeaveRequest?.reasonCode ?? null,
        // 早退申請
        useLateArrival: !!lateArrivalRequest,
        lateArrivalReason: lateArrivalRequest?.reasonText ?? null,
        lateArrivalReasonCode: lateArrivalRequest?.reasonCode ?? null,
        // 休日出勤
        useHolidayWork: !!holidayWorkRequest,
        holidayWorkStartTime: holidayWorkRequest?.startTime ?? null,
        holidayWorkEndTime: holidayWorkRequest?.endTime ?? null,
        holidayWorkSubstituteLeaveType:
          holidayWorkRequest?.substituteLeaveType ?? null,
        holidayWorkRemarks: holidayWorkRequest?.remark ?? null,
      };
    }),
  };
};

export default ((timesheet) =>
  Api.invoke({
    path: '/att/timesheet-import/save',
    param: convertToParam(timesheet),
  })) as ITimesheetRepository['save'];
