import { CODE } from '../../../AttDailyRequestType';
import { Timesheet } from '../../Timesheet';

const $allDummyValue = {
  employeeId: 'employeeId',
  records: [
    {
      id: 'id',
      recordDate: 'recordDate',
      startTime: 'startTime',
      endTime: 'endTime',
      dayType: 'Workday',
      restTimes: [
        {
          startTime: 'rest1StartTime',
          endTime: 'rest1EndTime',
          restReason: {
            id: '',
            code: 'rest1ReasonCode',
            name: '',
          },
        },
        {
          startTime: 'rest2StartTime',
          endTime: 'rest2EndTime',
          restReason: {
            id: '',
            code: 'rest2ReasonCode',
            name: '',
          },
        },
      ],
      requests: [
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.Leave,
          startDate: 'leaveRequest1StartDate',
          endDate: 'leaveRequest1EndDate',
          startTime: 'leaveRequest1StartTime',
          endTime: 'leaveRequest1EndTime',
          leaveCode: 'leaveRequest1LeaveCode',
          leaveName: 'leaveRequest1LeaveName',
          leaveType: 'leaveRequest1LeaveType',
          leaveRange: 'leaveRequest1LeaveRange',
          remarks: 'leaveRequest1Remarks',
          reason: 'leaveRequest1Reason',
          requireReason: 'leaveRequest1RequireReason',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.OvertimeWork,
          targetDate: 'overtimeWorkRequestTargetDate',
          startTime: 'overtimeWorkRequestStartTime',
          endTime: 'overtimeWorkRequestEndTime',
          remarks: 'overtimeWorkRequestRemarks',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyStartWork,
          targetDate: 'earlyStartWorkRequestTargetDate',
          startTime: 'earlyStartWorkRequestStartTime',
          endTime: 'earlyStartWorkRequestEndTime',
          remarks: 'earlyStartWorkRequestRemarks',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyLeave,
          targetDate: 'earlyLeaveRequestTargetDate',
          reasonText: 'earlyLeaveRequestReasonText',
          reasonCode: 'earlyLeaveRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.LateArrival,
          targetDate: 'lateArrivalRequestTargetDate',
          reasonText: 'lateArrivalRequestReasonText',
          reasonCode: 'lateArrivalRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.HolidayWork,
          startTime: 'holidayWorkRequestStartTime',
          endTime: 'holidayWorkRequestEndTime',
          substituteLeaveType: 'holidayWorkRequestSubstituteLeaveType',
          remark: 'holidayWorkRequestRemark',
        },
      ],
      comment: 'comment',
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as { [key in keyof Timesheet]: any };

export const allDummyValue = $allDummyValue as unknown as Timesheet;
