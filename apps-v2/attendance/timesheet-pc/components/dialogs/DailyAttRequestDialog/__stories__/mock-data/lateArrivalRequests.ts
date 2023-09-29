import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  LateArrivalRequest,
} from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LateArrivalReason } from '@attendance/domain/models/LateArrivalReason';

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

export const LateArrivalAndUseLateArrivalReasonRequest: LateArrivalRequest =
  create({
    ...defaultValue,
    requestTypeCode: CODE.LateArrival,
    startDate: '2018-06-18',
    endDate: '2018-06-18',
    startTime: 60 * 9,
    endTime: 60 * 12,
    approver01Name: 'Approver',
    isForReapply: false,
    reasonId: 'a172v00000deeEvAAI',
  });

export const LateArrivalReasonList: LateArrivalReason[] = [
  {
    id: 'a172v00000deeEvAAI',
    name: '遅刻理由テスト1',
    code: 'testCode001',
  },
  {
    id: 'a172v00000deeEvAA3',
    name: '遅刻理由テスト2',
    code: 'testCode002',
  },
];
