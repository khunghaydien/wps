import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  DirectRequest,
} from '@attendance/domain/models/AttDailyRequest/DirectRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

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
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 18,
      endTime: 60 * 19,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: null,
      endTime: null,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
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
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 11,
      endTime: 60 * 11 + 10,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 12,
      endTime: 60 * 13,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 14,
      endTime: 60 * 14 + 10,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 15,
      endTime: 60 * 15 + 10,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
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
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 60 * 18,
      endTime: 60 * 19,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: null,
      endTime: null,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
  ],
  remarks: 'remarks',
  approver01Name: 'Approver',
  isForReapply: false,
});
