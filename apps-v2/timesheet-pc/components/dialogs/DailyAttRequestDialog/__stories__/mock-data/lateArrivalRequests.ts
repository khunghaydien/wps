import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  LateArrivalRequest,
} from '../../../../../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';

export const AdvanceRequest: LateArrivalRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.EarlyLeave,
  startDate: '2018-06-18',
  endDate: '2018-06-18',
  startTime: 60 * 9,
  endTime: null,
  reason: 'reason',
  approver01Name: 'Approver',
  isForReapply: false,
});

export const AfterRequest: LateArrivalRequest = create({
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
