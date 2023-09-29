import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  DirectRequest,
} from '../../../../../../domain/models/attendance/AttDailyRequest/DirectRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';

export const OneDay: DirectRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.Direct,
  startDate: '2018-06-18',
  endDate: '2018-06-18',
  startTime: 60 * 9,
  endTime: 60 * 18,
  directApplyRestTimes: [
    {
      startTime: 60 * 12,
      endTime: 60 * 13,
    },
    {
      startTime: 60 * 18,
      endTime: 60 * 19,
    },
    {
      startTime: null,
      endTime: null,
    },
  ],
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});

export const FullRestTimes: DirectRequest = create({
  ...defaultValue,
  startDate: '2018-06-18',
  startTime: 60 * 9,
  endTime: 60 * 16,
  directApplyRestTimes: [
    {
      startTime: 60 * 10,
      endTime: 60 * 10 + 10,
    },
    {
      startTime: 60 * 11,
      endTime: 60 * 11 + 10,
    },
    {
      startTime: 60 * 12,
      endTime: 60 * 13,
    },
    {
      startTime: 60 * 14,
      endTime: 60 * 14 + 10,
    },
    {
      startTime: 60 * 15,
      endTime: 60 * 15 + 10,
    },
  ],
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});

export const Range: DirectRequest = create({
  ...defaultValue,
  startDate: '2018-06-18',
  endDate: '2018-07-31',
  startTime: 60 * 9,
  endTime: 60 * 18,
  directApplyRestTimes: [
    {
      startTime: 60 * 12,
      endTime: 60 * 13,
    },
    {
      startTime: 60 * 18,
      endTime: 60 * 19,
    },
    {
      startTime: null,
      endTime: null,
    },
  ],
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});
