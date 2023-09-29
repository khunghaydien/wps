import STATUS from '../../../../../../domain/models/approval/request/Status';
import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  HolidayWorkRequest,
} from '../../../../../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';
import { SUBSTITUTE_LEAVE_TYPE } from '../../../../../../domain/models/attendance/SubstituteLeaveType';

export const noSubstitute: HolidayWorkRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.None,
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const substitute: HolidayWorkRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
  substituteDate: '2019-10-10',
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const compensatoryStocked: HolidayWorkRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const reapply: HolidayWorkRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  status: STATUS.Approved,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
  substituteDate: '2019-10-10',
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});
