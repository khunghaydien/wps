import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import { defaultValue as requestDefaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { ACTUAL_WORKING_PERIOD_TYPE } from '@attendance/domain/models/DailyActualWorkingTimePeriod';

const ONE_HOUR_MINUTE = 60;

export const actualWorkingPeriods = [
  {
    startTime: 10 * ONE_HOUR_MINUTE,
    endTime: 12.5 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN,
  },
  {
    startTime: 12.5 * ONE_HOUR_MINUTE,
    endTime: 13.5 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.REST,
  },
  {
    startTime: 13.5 * ONE_HOUR_MINUTE,
    endTime: 18 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN,
  },
  {
    startTime: 18 * ONE_HOUR_MINUTE,
    endTime: 19 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_IN,
  },
  {
    startTime: 19 * ONE_HOUR_MINUTE,
    endTime: 23 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_OUT,
  },
];

export const contractedPeriods = [
  { startTime: 10 * ONE_HOUR_MINUTE, endTime: 12 * ONE_HOUR_MINUTE },
];

export const scheduledWorkingHours: AttDailyRecordContractedDetail = {
  /* 出勤時刻 */
  startTime: 9 * ONE_HOUR_MINUTE,

  /* 退勤時刻 */
  endTime: 25 * ONE_HOUR_MINUTE,

  /* 休憩時刻 */
  restTimes: [
    {
      startTime: 13 * ONE_HOUR_MINUTE,
      endTime: 14 * ONE_HOUR_MINUTE,
      restReason: null,
    },
  ],
};

export const createLeaveRequest = (arg: {
  startTime: LeaveRequest['startTime'];
  endTime: LeaveRequest['endTime'];
  leaveType: LeaveRequest['leaveType'];
  leaveRange: LeaveRequest['leaveRange'];
}): LeaveRequest => ({
  ...requestDefaultValue,
  ...arg,
  type: CODE.Leave,
  startDate: '',
  endDate: '',
  leaveCode: '',
  leaves: null,
  leaveName: '',
  requireReason: false,
});
