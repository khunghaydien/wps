import { defaultValue } from '../../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  EarlyLeaveRequest,
} from '../../../../../../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';
import { CODE } from '../../../../../../../domain/models/attendance/AttDailyRequestType';

export const AdvanceRequest: EarlyLeaveRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.EarlyLeave,
  startDate: '2018-06-18',
  endDate: '2018-06-18',
  startTime: null,
  endTime: 60 * 19,
  reason: 'reason',
  approver01Name: 'Approver',
  isForReapply: false,
});

export const AfterRequest: EarlyLeaveRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.EarlyLeave,
  startDate: '2018-06-18',
  endDate: '2018-06-18',
  startTime: 60 * 18,
  endTime: 60 * 19,
  reason: 'reason',
  approver01Name: 'Approver',
  isForReapply: false,
});
