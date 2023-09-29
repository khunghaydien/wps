import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  PatternRequest,
} from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

export const attPatternList = [
  {
    name: 'pattern1',
    code: 'pattern1',
    startTime: 300,
    endTime: 1320,
    restTimes: [
      {
        startTime: 420,
        endTime: 480,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 600,
        endTime: 660,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 780,
        endTime: 900,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1200,
        endTime: 1260,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Modified',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  {
    name: 'pattern2',
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Modified',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
];

export const selectedAttPattern = {
  name: 'pattern2',
  code: 'pattern2',
  startTime: 300,
  endTime: 1320,
  restTimes: [
    {
      startTime: 420,
      endTime: 480,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 600,
      endTime: 660,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 780,
      endTime: 900,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 1020,
      endTime: 1080,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 1200,
      endTime: 1260,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
  ],
  workSystem: 'JP:Modified',
  flexStartTime: null,
  flexEndTime: null,
  withoutCoreTime: false,
};

export const defaultPatternRequest: PatternRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.Pattern,
  startDate: '2018-06-18',
  endDate: '2018-06-19',
  startTime: 60 * 9,
  endTime: 60 * 19,
  reason: 'reason',
  approver01Name: 'Approver',
  isForReapply: false,
  patternCode: 'pattern1',
  patternName: 'pattern1',
});
