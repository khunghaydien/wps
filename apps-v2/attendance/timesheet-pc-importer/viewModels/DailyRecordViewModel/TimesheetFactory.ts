import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import * as DailyRecord from '@attendance/domain/models/importer/DailyRecord';
import * as Timesheet from '@attendance/domain/models/importer/Timesheet';

import * as DailyRecordViewModel from '.';

const createRestTime = (
  record: DailyRecordViewModel.DailyRecordViewModel
): DailyRecord.DailyRecord['restTimes'] => {
  const restTime: DailyRecord.DailyRecord['restTimes'] = [];
  if (
    (record.rest1StartTime ?? null) !== null &&
    (record.rest1EndTime ?? null) !== null
  ) {
    restTime.push({
      startTime: record.rest1StartTime,
      endTime: record.rest1EndTime,
      restReason: {
        id: '',
        code: record.rest1ReasonCode,
        name: '',
      },
    });
  }
  if (
    (record.rest2StartTime ?? null) !== null &&
    (record.rest2EndTime ?? null) !== null
  ) {
    restTime.push({
      startTime: record.rest2StartTime,
      endTime: record.rest2EndTime,
      restReason: {
        id: '',
        code: record.rest2ReasonCode,
        name: '',
      },
    });
  }
  return restTime;
};

const creteRequests = (
  record: DailyRecordViewModel.DailyRecordViewModel
): DailyRecord.DailyRecord['requests'] => {
  const requests: DailyRecord.DailyRecord['requests'] = [];
  const base = {
    id: null,
    requestTypeName: null,
    status: null,
  };
  if (record.appliedLeaveRequest1) {
    requests.push({
      ...base,
      type: CODE.Leave,
      startDate: record.recordDate,
      endDate: record.recordDate,
      startTime: record.leaveRequest1StartTime,
      endTime: record.leaveRequest1EndTime,
      leaveCode: record.leaveRequest1Code,
      leaveName: '',
      leaveType: null,
      leaveRange: record.leaveRequest1Range,
      remarks: record.leaveRequest1Remark,
      reason: record.leaveRequest1Reason,
      requireReason: false,
    });
  }
  if (record.appliedOvertimeWorkRequest) {
    requests.push({
      ...base,
      type: CODE.OvertimeWork,
      targetDate: record.recordDate,
      startTime: record.overtimeWorkRequestStartTime,
      endTime: record.overtimeWorkRequestEndTime,
      remarks: record.overtimeWorkRequestRemark,
    });
  }
  if (record.appliedEarlyStartWorkRequest) {
    requests.push({
      ...base,
      type: CODE.EarlyStartWork,
      targetDate: record.recordDate,
      startTime: record.earlyStartWorkRequestStartTime,
      endTime: record.earlyStartWorkRequestEndTime,
      remarks: record.earlyStartWorkRequestRemark,
    });
  }
  if (record.appliedEarlyLeaveRequest) {
    requests.push({
      ...base,
      type: CODE.EarlyLeave,
      targetDate: record.recordDate,
      startTime: null,
      endTime: null,
      reasonText: record.earlyLeaveRequestReasonText,
      reasonCode: record.earlyLeaveRequestReasonCode,
    });
  }
  if (record.appliedLateArrivalRequest) {
    requests.push({
      ...base,
      type: CODE.LateArrival,
      targetDate: record.recordDate,
      startTime: null,
      endTime: null,
      reasonText: record.lateArrivalRequestReasonText,
      reasonCode: record.lateArrivalRequestReasonCode,
    });
  }
  if (record.appliedHolidayWorkRequest) {
    requests.push({
      ...base,
      type: CODE.HolidayWork,
      targetDate: record.recordDate,
      startTime: record.holidayWorkRequestStartTime,
      endTime: record.holidayWorkRequestEndTime,
      substituteLeaveType: record.holidayWorkRequestSubstituteLeaveType,
      substituteDate: null,
      reason: null,
      remark: record.holidayWorkRequestRemark,
    });
  }
  return requests;
};

export default {
  create: ({ employeeId, records: $records }) => {
    const records = DailyRecordViewModel.filterForSubmitting($records).map(
      (record): DailyRecord.DailyRecord => ({
        id: '',
        recordDate: record.recordDate,
        startTime: record.startTime,
        endTime: record.endTime,
        restTimes: createRestTime(record),
        requests: creteRequests(record),
        comment: record.comment,
      })
    );
    return {
      employeeId,
      startDate: records.at(0)?.recordDate || null,
      endDate: records.at(-1)?.recordDate || null,
      records,
    };
  },
} as Timesheet.ITimesheetFactory<{
  employeeId: string;
  records: DailyRecordViewModel.DailyRecordViewModel[];
}>;
