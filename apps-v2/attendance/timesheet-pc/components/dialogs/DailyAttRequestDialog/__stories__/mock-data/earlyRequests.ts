import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  EarlyLeaveRequest,
} from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { EarlyLeaveReason } from '@attendance/domain/models/EarlyLeaveReason';

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

export const EarlyLeaveAndUseEarlyLeaveReasonRequest: EarlyLeaveRequest =
  create({
    ...defaultValue,
    requestTypeCode: CODE.EarlyLeave,
    startDate: '2022-12-28',
    endDate: '2022-12-28',
    startTime: 60 * 18,
    endTime: 60 * 19,
    approver01Name: 'Approver',
    isForReapply: false,
    reasonId: 'a172v00000deeEvAAI',
  });

export const EarlyLeaveReasonList: EarlyLeaveReason[] = [
  {
    id: 'a172v00000deeEvAAI',
    name: '早退理由テスト1',
    code: 'testCode001',
    earlyLeaveEndTime: 300,
  },
  {
    id: 'a172v00000deeEvAA3',
    name: '早退理由テスト2',
    code: 'testCode002',
    earlyLeaveEndTime: 360,
  },
];

export const selectedEarlyLeaveReason = {
  id: 'a172v00000deeEvAA3',
  name: '早退理由テスト2',
  code: 'testCode002',
  earlyLeaveEndTime: 360,
};
