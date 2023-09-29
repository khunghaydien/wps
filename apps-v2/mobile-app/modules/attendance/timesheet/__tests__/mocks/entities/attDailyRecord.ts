import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import { AttDailyRecord, ROW_TYPE } from '../../../entities';

export const defaultValue: AttDailyRecord = {
  id: '',
  recordDate: '',
  dayType: DAY_TYPE.Workday,
  startTime: null,
  endTime: null,
  startStampTime: null,
  endStampTime: null,
  restTimes: [],
  requestTypeCodes: [],
  requestIds: [],
  contractedDetail: null,
  ciliTimePeriods: [],
  ciloTimePeriods: [],
  coliTimePeriods: [],
  coloTimePeriods: [],
  remarks: '',
  isLeaveOfAbsence: false,
  insufficientRestTime: null,
  restHours: null,
  otherRestReason: null,
  outStartTime: null,
  outEndTime: null,
  approver01Name: '',
  realWorkTime: null,
  earlyStartWorkApplyDefaultEndTime: null,
  overtimeWorkApplyDefaultStartTime: null,
  lateArrivalStartTime: null,
  earlyLeaveEndTime: null,
  useManageLateArrivalPersonalReason: false,
  useManageEarlyLeavePersonalReason: false,
  flexStartTime: null,
  flexEndTime: null,
  withoutCoreTime: null,
  workSystem: '',
  rowType: ROW_TYPE.WORKDAY,
  remarkableRequestStatus: null,
  fixDailyRequest: {
    id: null,
    status: null,
    approver01Name: null,
    performableActionForFix: 'None',
  },
  requestDayType: null,
  isLocked: false,
  isHolLegalHoliday: false,
  editable: true,
  requiredInput: true,
  outInsufficientMinimumWorkHours: 0,
  isFlexWithoutCore: false,
  isFlexWithoutCoreRequireEarlyLeaveApply: false,
  personalReasonEarlyLeaveEndTime: null,
  objectiveReasonEarlyLeaveEndTime: null,
  commuteCount: null,
};