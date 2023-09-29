import {
  AbsenceRequest,
  create,
} from '../../../../../../domain/models/attendance/AttDailyRequest/AbsenceRequest';
import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';

export const OneDay: AbsenceRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.Absence,
  startDate: '2018-06-18',
  endDate: '2018-06-18',
  reason: 'reason',
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});

export const Range: AbsenceRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.Absence,
  startDate: '2018-06-18',
  endDate: '2018-07-31',
  reason: 'reason',
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});
